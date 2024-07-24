# Use official bun image for the builder
FROM --platform=$BUILDPLATFORM oven/bun:1 as builder

# Set up arguments for targeting builds
ARG TARGETPLATFORM
ARG BUILDPLATFORM

WORKDIR /app
COPY . .

# Compile as a binary for the target architecture 
RUN case "$TARGETPLATFORM" in \
    "linux/amd64") TARGET="bun-linux-x64-baseline" ;; \
    "linux/arm64") TARGET="bun-linux-arm64" ;; \
    *) echo "Unsupported platform: $TARGETPLATFORM" && exit 1 ;; \
    esac && \
    bun build --compile --minify --sourcemap ./index.js --target $TARGET --outfile widget-server

# Use a distroless glibc image for minimal Docker image size
FROM cgr.dev/chainguard/glibc-dynamic:latest@sha256:a9cea20608270d361c98cd3304b90baa56a33ff3489a36220c75b18caf22bbe7

# Copy the compiled binary from the builder
COPY --from=builder /app/widget-server /widget-server

# Run the binary
EXPOSE 3000
CMD ["/widget-server"]
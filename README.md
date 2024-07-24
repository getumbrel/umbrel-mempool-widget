# Mempool Widget API Server

<img width="410" alt="Screenshot 2024-07-24 at 8 34 23 PM" src="https://github.com/user-attachments/assets/b4f63f1b-5fb3-47bc-922f-1dc48dcb430c">


This is a server application that fetches recommended transaction fee data from a specified mempool's instance API and serves it in a formatted JSON response that's expected by umbrelOS 1.0+ to display the widget. 

The server is built using the bun JavaScript framework and is containerized as a distroless Docker image for umbrelOS.

## Application overview

The server application is defined in `index.js`. It fetches fee data from the upstream API, formats the data into a specific JSON structure, and serves the formatted data at the `/widgets/fees` endpoint.

If the upstream API request fails for any reason, the handler returns a default response with placeholder fee data.

## Docker overview

The Dockerfile defines a multi-stage Docker build process. The first stage uses the official bun image to compile the server application into a binary. The second stage uses a distroless glibc image to create a minimal Docker image. The compiled binary is copied from the first stage into the second stage, and the binary is run when a container is started from the image.

The Dockerfile uses build arguments to target specific architectures (x86 and arm64) during the build process. The `TARGETPLATFORM` argument is used to select the appropriate bun target for the architecture.

## Running locally

To run the server, you can build and run a Docker container using the Dockerfile. The server will start on port 3000 and will serve the fee data at the `/widgets/fees` endpoint.

> Note: You will need to set the `MEMPOOL_API_URL` environment variable to the URL of your upstream API before starting the server. If you don't have a local mempool instance, you may set it to `https://mempool.space/api/v1/fees/recommended`.

If you wish to run the server locally for development, simply install bun on your system and run `bun index.js` in the project's directory.

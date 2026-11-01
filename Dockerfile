FROM node:22-alpine

WORKDIR /app

# Copy project definition
COPY package.json ./

# Copy server code and outputs
COPY work ./work
COPY outputs ./outputs

# Expose port (default 4173 or environment PORT)
ENV PORT=4173
EXPOSE 4173

# Start the Chato server
CMD ["node", "work/server.mjs"]

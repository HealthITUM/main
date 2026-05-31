# Stage 1: Build the optimized Go binary
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /ingestor main.go

# Stage 2: Run inside a tiny, secure image
FROM alpine:latest
WORKDIR /
COPY --from=builder /ingestor /ingestor
CMD ["/ingestor"]
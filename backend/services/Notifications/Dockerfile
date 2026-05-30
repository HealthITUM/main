FROM golang:1.25-alpine AS builder

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o notif-service ./cmd

FROM alpine:3.20

WORKDIR /app

COPY --from=builder /build/notif-service .

RUN apk --no-cache add ca-certificates

CMD ["./notif-service"]
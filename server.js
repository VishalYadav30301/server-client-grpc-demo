const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf definition
const packageDefinition = protoLoader.loadSync('message_service.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const messageProto = grpc.loadPackageDefinition(packageDefinition).message;

// Implement the service
const messageService = {
  SendMessage: (call, callback) => {
    const { content, sender, priority } = call.request;
    
    console.log(`Received message from ${sender}: ${content} (Priority: ${priority})`);
    
    // Process the message (in a real app, you might save to DB, etc.)
    const response = {
      success: true,
      status: 'Message processed successfully',
      received_at: new Date().toISOString()
    };
    
    callback(null, response);
  }
};

// Create the server
const server = new grpc.Server();
server.addService(messageProto.MessageService.service, messageService);

// Start the server
server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to start server:', err);
      return;
    }
    console.log(`Server running on port ${port}`);
    server.start();
  }
);
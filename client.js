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

// Create the client
const client = new messageProto.MessageService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Prepare the message
const message = {
  content: 'Hello from the gRPC client!',
  sender: 'Node.js Client',
  priority: 1
};

// Make the gRPC call
client.SendMessage(message, (err, response) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('Server response:', response);
});
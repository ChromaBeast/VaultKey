import 'package:vaultkey/vaultkey.dart';

void main() async {
  // Initialize the VaultKey client
  // By default, it uses host: 'http://localhost:8080'
  final client = Vaultkey(
    apiKey: 'your_api_key_here',
  );

  print('VaultKey Dart SDK Example');
  print('========================');

  try {
    // 1. Fetching all decrypted secrets as a Map (using values)
    print('Fetching all secrets in the "default" project for "production" environment...');
    final secrets = await client.values('default', 'production');
    print('Secrets fetched successfully:');
    secrets.forEach((key, value) {
      print('  $key = $value');
    });

    // 2. Getting a single secret
    print('\nFetching single secret "DATABASE_URL"...');
    final dbUrl = await client.get('DATABASE_URL', 'default', 'production');
    print('DATABASE_URL: $dbUrl');

    // 3. Listing secret metadata
    print('\nListing secret metadata...');
    final metadataList = await client.list('default', 'production');
    print('Metadata list:');
    for (var meta in metadataList) {
      print('  - Key: ${meta['key']}, Version: ${meta['version']}');
    }

    // 4. Using the inject method
    print('\nCalling inject to get the environment Map...');
    final envVars = await client.inject('default', 'production');
    print('Fetched env variables: $envVars');

  } catch (e) {
    print('\nError interacting with VaultKey server:');
    print(e);
    print('\nMake sure the VaultKey server is running at http://localhost:8080, unlocked, and that your API key is valid.');
  }
}

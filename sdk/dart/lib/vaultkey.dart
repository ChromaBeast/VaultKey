import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

/// A Dart SDK client for VaultKey secret manager.
class Vaultkey {
  /// The host URL of the VaultKey server.
  final String host;

  /// The API key used for authenticating with the VaultKey server.
  final String apiKey;

  /// Constructor taking [host] (default: 'http://localhost:8080') and [apiKey].
  Vaultkey({
    String host = 'http://localhost:8080',
    required this.apiKey,
  }) : host = host.endsWith('/') ? host.substring(0, host.length - 1) : host;

  /// Helper method to perform HTTP requests to the VaultKey server.
  Future<dynamic> _request(String path) async {
    final url = Uri.parse('$host$path');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $apiKey',
    };

    final response = await http.get(url, headers: headers);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      String errorMessage;
      try {
        final data = jsonDecode(response.body);
        errorMessage = data['error'] ?? 'Request failed with status: ${response.statusCode}';
      } catch (_) {
        errorMessage = 'Request failed with status: ${response.statusCode}';
      }
      throw Exception('VaultKey request failed: $errorMessage (status: ${response.statusCode})');
    }

    if (response.body.isEmpty) {
      return null;
    }
    return jsonDecode(response.body);
  }

  /// Retrieves the decrypted value of a single secret.
  Future<String> get(String key, [String project = 'default', String env = 'production']) async {
    final path = '/v1/secrets/${Uri.encodeComponent(key)}?project=${Uri.encodeComponent(project)}&environment=${Uri.encodeComponent(env)}';
    final res = await _request(path);
    if (res is Map && res.containsKey('value')) {
      return res['value'] as String;
    }
    return '';
  }

  /// Lists secret metadata.
  Future<List<dynamic>> list([String project = 'default', String env = 'production']) async {
    final path = '/v1/secrets?project=${Uri.encodeComponent(project)}&environment=${Uri.encodeComponent(env)}';
    final res = await _request(path);
    if (res is List) {
      return res;
    }
    return [];
  }

  /// Fetch all decrypted secrets in the scope as a Map in a single request (using `/v1/secrets/values`).
  Future<Map<String, String>> values([String project = 'default', String env = 'production']) async {
    final path = '/v1/secrets/values?project=${Uri.encodeComponent(project)}&environment=${Uri.encodeComponent(env)}';
    final res = await _request(path);
    if (res is Map) {
      return res.map((key, value) => MapEntry(key.toString(), value.toString()));
    }
    return {};
  }

  /// Fetches the secrets and returns a Map.
  ///
  /// Note: [Platform.environment] is read-only in Dart. Therefore, we cannot
  /// automatically write/inject secrets directly into the system's environment variables.
  /// Instead, this method fetches the secrets and returns them as a Map for in-memory use.
  Future<Map<String, String>> inject([String project = 'default', String env = 'production']) async {
    return values(project, env);
  }
}

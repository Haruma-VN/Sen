/// [condition] - Conditional
/// If [condition] is not true, the [message] will be throw
///

void assertTest(bool condition, String message) {
  if (!condition) {
    throw Exception(message);
  }
  return;
}

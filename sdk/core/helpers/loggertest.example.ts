/**
 * Example usage and testing of the environment-aware logger
 * 
 * This demonstrates how the logger behaves in different environments
 */

import { logger } from './logger';

// Simulate different environments for testing
function testLogger() {
  console.log('=== Logger Behavior Tests ===\n');

  // Test 1: Connection messages (always allowed)
  console.log('Test 1: Connection messages (allowed in production)');
  logger.log('[FlagClient] Connected');
  logger.log('[WebSocketTransport] Disconnected');
  logger.log('[FlagClient] Flagmint SDK is connected');
  
  // Test 2: Regular debug messages (blocked in production)
  console.log('\nTest 2: Debug messages (blocked in production)');
  logger.log('[FlagClient] Initialization started');
  logger.log('[FlagClient] Flags updated via transport');
  
  // Test 3: Error messages (blocked in production)
  console.log('\nTest 3: Error messages (blocked in production)');
  logger.error('[FlagClient] Error updating flags');
  
  // Test 4: Warning messages (blocked in production)  
  console.log('\nTest 4: Warning messages (blocked in production)');
  logger.warn('[FlagClient] WebSocket failed, falling back to long polling');

  console.log('\n=== Current Environment:', process.env.NODE_ENV || 'development', '===');
}

// Uncomment to test:
// testLogger();

export { testLogger };

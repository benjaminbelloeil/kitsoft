type EventHandler = (...args: any[]) => void;

/**
 * Simple event emitter to enable communication between components
 */
class EventEmitterClass {
  private events: Record<string, EventHandler[]> = {};

  /**
   * Register an event handler
   * @param event The event name
   * @param handler The callback function
   */
  on(event: string, handler: EventHandler): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  /**
   * Remove an event handler
   * @param event The event name
   * @param handler The callback function to remove
   */
  off(event: string, handler: EventHandler): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(h => h !== handler);
  }

  /**
   * Emit an event with data
   * @param event The event name
   * @param args Arguments to pass to handlers
   */
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(handler => {
      handler(...args);
    });
  }
}

// Export a singleton instance
export const EventEmitter = new EventEmitterClass();

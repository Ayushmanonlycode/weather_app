/**
 * Represents the Network Information API interface
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
interface NetworkInformation extends EventTarget {
  /** The type of connection the device is using */
  readonly type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  /** The effective type of the connection */
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  /** The downlink speed in Mbps */
  readonly downlink: number;
  /** The round-trip time in milliseconds */
  readonly rtt: number;
  /** Whether the user has requested reduced data usage */
  readonly saveData: boolean;
  /** Event handler for network changes */
  onchange: ((this: NetworkInformation, ev: Event) => any) | null;
}

/**
 * Extends the Navigator interface to include network information
 */
interface Navigator {
  /** The NetworkInformation object for the current connection */
  readonly connection?: NetworkInformation;
}

/**
 * Represents a network quality change event
 */
interface NetworkQualityChangeEvent extends Event {
  /** The previous network type */
  previousType: NetworkInformation['type'];
  /** The new network type */
  newType: NetworkInformation['type'];
  /** The previous effective type */
  previousEffectiveType: NetworkInformation['effectiveType'];
  /** The new effective type */
  newEffectiveType: NetworkInformation['effectiveType'];
} 
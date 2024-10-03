declare module '@cashfreepayments/cashfree-js' {
    interface CashfreeOptions {
        mode: 'sandbox' | 'production';
        // Add other options as required
      }
    
      interface Cashfree {
        // Define methods and properties as needed
        someMethod: (params: any) => any;
        // Example: add other methods or properties that `cashfree` should have
      }
    
      export function load(options: CashfreeOptions): Promise<Cashfree>;
  }
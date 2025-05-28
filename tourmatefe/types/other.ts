export function formatNumber(num: number): string {
    // Split the number into integral and fractional parts
    const [integralPart, fractionalPart] = num.toString().split('.');
    
    // Format the integral part with thousands separators
    const formattedIntegral = integralPart
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})(?=\d)/g, '$1.')
        .split('')
        .reverse()
        .join('');
    
    // Combine the parts with the appropriate separators
    return fractionalPart 
        ? `${formattedIntegral},${fractionalPart}` 
        : formattedIntegral;
}
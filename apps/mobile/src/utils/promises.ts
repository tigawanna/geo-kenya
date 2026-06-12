export async function sleepFor(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

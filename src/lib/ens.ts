export async function resolveENS(addressOrName: string): Promise<{
  address: string;
  ensName: string | null;
}> {
  if (addressOrName.endsWith(".eth") || addressOrName.endsWith(".base.eth")) {
    try {
      const res = await fetch(
        `https://api.ensideas.com/ens/resolve/${encodeURIComponent(addressOrName)}`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.address) {
          return { address: data.address, ensName: data.name || addressOrName };
        }
      }
    } catch {
      // Fall through
    }
    throw new Error("Could not resolve ENS name");
  }

  const address = addressOrName;
  let ensName: string | null = null;

  try {
    const res = await fetch(
      `https://api.ensideas.com/ens/resolve/${encodeURIComponent(address)}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.name) {
        ensName = data.name;
      }
    }
  } catch {
    // Ignore
  }

  return { address, ensName };
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isValidAddress(input: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(input);
}

export function isValidENS(input: string): boolean {
  return input.endsWith(".eth");
}

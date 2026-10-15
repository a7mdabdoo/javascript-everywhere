/**
 * Day 06 — Task 14: GitHub Public API Lab
 * github-lab.ts
 */

console.log("=== Task 14: GitHub Public API Lab ===");

// 14.1 — GitHub User Interface & Type Guard:
export interface GitHubUser {
  readonly login: string;
  readonly id: number;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isGitHubUser(value: unknown): value is GitHubUser {
  if (!isRecord(value)) return false;
  if (typeof value["login"] !== "string") return false;
  if (typeof value["id"] !== "number") return false;
  if (typeof value["public_repos"] !== "number") return false;
  if (typeof value["followers"] !== "number") return false;
  return true;
}

const GITHUB_USERNAME = "a7mdabdoo";

async function fetchUserProfile(username: string): Promise<GitHubUser | null> {
  const url = `https://api.github.com/users/${username}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Antigravity-Student-Lab",
      Accept: "application/vnd.github.v3+json",
    },
  });

  console.log(`\n--- Fetching user: ${username} ---`);
  console.log("HTTP Status     :", res.status);
  console.log("Status OK       :", res.ok);
  console.log("Status Text     :", res.statusText);
  console.log("Content-Type    :", res.headers.get("content-type"));

  // Rate limit header:
  const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
  console.log("RateLimit Left  :", rateLimitRemaining);
  // Explanation: x-ratelimit-remaining tells you how many unauthenticated requests are left in the current 1-hour window (max 60/hr).

  if (!res.ok) {
    console.error(`[GitHub API Error]: Failed to fetch user ${username} (HTTP ${res.status}: ${res.statusText})`);
    return null;
  }

  const rawData: unknown = await res.json();
  if (!isGitHubUser(rawData)) {
    throw new Error("Received response does not conform to GitHubUser interface");
  }

  return rawData;
}

const user = await fetchUserProfile(GITHUB_USERNAME);
if (user) {
  console.log(`Name : ${user.name ?? "—"}`);
  console.log(`Bio  : ${user.bio ?? "—"}`);
  console.log(`Repos: ${user.public_repos} | Followers: ${user.followers}`);
}


console.log("\n=== 14.2 — Query Strings & URLSearchParams ===");

// 1. Fetch user repos with URL + searchParams:
export interface GitHubRepo {
  readonly id: number;
  name: string;
  language: string | null;
  stargazers_count: number;
}

const reposUrl = new URL(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
reposUrl.searchParams.set("sort", "updated");
reposUrl.searchParams.set("per_page", "5");

console.log("Built URL:", reposUrl.toString());

try {
  const repoRes = await fetch(reposUrl.toString(), {
    headers: { "User-Agent": "Antigravity-Student-Lab" },
  });
  if (repoRes.ok) {
    const reposData = (await repoRes.json()) as GitHubRepo[];
    console.log("Recent 5 Repositories:");
    for (const r of reposData) {
      console.log(` - ${r.name.padEnd(25)} | Lang: ${(r.language ?? "—").padEnd(12)} | Stars: ${r.stargazers_count}`);
    }
  }
} catch (err: unknown) {
  console.log("Repo fetch skipped or offline:", err instanceof Error ? err.message : String(err));
}

// 2. Safe encoding with spaces and colons:
const searchUrl = new URL("https://api.github.com/search/repositories");
searchUrl.searchParams.set("q", "javascript language:typescript");
console.log("\nEncoded Search URL:", searchUrl.toString());
// Note: Space encoded as '+' or '%20', and colon ':' safely preserved or percent-encoded.

// 3. Hand-built string bug with '&':
const searchTopic = "web & mobile";
const badHandbuiltUrl = `https://api.github.com/search/repositories?q=${searchTopic}`;
console.log("Broken Hand-built URL:", badHandbuiltUrl);
// '&' accidentally splits the query into two parameters: q='web ' and mobile='', corrupting the query.


console.log("\n=== 14.3 — Fetching Multiple Users Safely ===");

const usernames = ["a7mdabdoo", "octocat", "nonexistent-user-9999999999"];

// Fetching in parallel without losing valid users if one 404s:
const userPromises = usernames.map(async (u) => {
  const res = await fetch(`https://api.github.com/users/${u}`, {
    headers: { "User-Agent": "Antigravity-Student-Lab" },
  });
  if (!res.ok) {
    return { username: u, ok: false, status: res.status };
  }
  const data = (await res.json()) as { login: string; public_repos: number };
  return { username: u, ok: true, data };
});

const multipleResults = await Promise.all(userPromises);

for (const result of multipleResults) {
  if (result.ok && result.data) {
    console.log(`✓ User: ${result.data.login.padEnd(25)} (Repos: ${result.data.public_repos})`);
  } else {
    console.log(`✗ User: ${result.username.padEnd(25)} (Failed: HTTP ${result.status})`);
  }
}

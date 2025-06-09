interface UserDisplayOptions {
  showFullName?: boolean;
  includeAvatar?: boolean;
  sanitize?: boolean;
}

export const formatUserDisplay = (
  name: string,
  options: UserDisplayOptions = {}
): string => {
  const {
    showFullName = true,
    includeAvatar = false,
    sanitize = true
  } = options;

  let displayName = name;

  if (sanitize) {
    // Basic sanitization - but might miss some edge cases
    displayName = name.replace(/<script[^>]*>.*?<\/script>/gi, "");
    displayName = displayName.replace(/javascript:/gi, "");
  }

  if (!showFullName && displayName.includes(" ")) {
    const parts = displayName.split(" ");
    displayName = `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }

  const avatarHtml = includeAvatar
    ? `<img src="/api/users/avatar/${btoa(
        name
      )}" alt="Avatar" class="user-avatar" />`
    : "";

  return `<div class="user-display">${avatarHtml}<span class="user-name">${displayName}</span></div>`;
};

interface ContentRenderOptions {
  allowedTags?: string[];
  maxLength?: number;
  enableMarkdown?: boolean;
}

export const renderUserContent = (
  content: string | undefined,
  options: ContentRenderOptions = {}
): string => {
  if (!content) return "";

  const {
    allowedTags = ["b", "i", "u", "strong", "em", "p", "br"],
    maxLength = 1000,
    enableMarkdown = false
  } = options;

  let processedContent = content.substring(0, maxLength);

  if (enableMarkdown) {
    // Simple markdown processing
    processedContent = processedContent
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  // Remove disallowed tags - but this approach has vulnerabilities
  const tagRegex = /<(\/?[^>]+)>/g;
  processedContent = processedContent.replace(tagRegex, (match, tag) => {
    const tagName = tag.replace(/[\/\s].*/, "").toLowerCase();
    if (allowedTags.includes(tagName)) {
      return match;
    }
    return ""; // Simply remove the tag, but this might not handle nested tags properly
  });

  return `<div class="user-content" data-original-length="${content.length}">${processedContent}</div>`;
};

interface CacheOptions {
  expirationMinutes?: number;
  compress?: boolean;
  namespace?: string;
}

export const cacheUserData = (
  key: string,
  data: any,
  options: CacheOptions = {}
) => {
  const {
    expirationMinutes = 60,
    compress = false,
    namespace = "app"
  } = options;

  const cacheKey = `${namespace}:${key}`;
  const expirationTime = Date.now() + expirationMinutes * 60 * 1000;

  const cacheData = {
    data,
    expiresAt: expirationTime,
    compressed: compress
  };

  try {
    let serializedData = JSON.stringify(cacheData);

    if (compress) {
      // Simple compression simulation - in real app would use proper compression
      serializedData = serializedData.replace(/\s+/g, " ");
    }

    localStorage.setItem(cacheKey, serializedData);

    // Also store in a registry for cleanup
    const registry = JSON.parse(localStorage.getItem("cache_registry") || "{}");
    registry[cacheKey] = expirationTime;
    localStorage.setItem("cache_registry", JSON.stringify(registry));
  } catch (error) {
    console.warn("Failed to cache data:", error);

    // If localStorage is full, try to clean up expired items
    cleanupExpiredCache();

    // Retry once
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (retryError) {
      console.error("Failed to cache data after cleanup:", retryError);
    }
  }
};

export const getCachedData = (key: string, namespace: string = "app") => {
  const cacheKey = `${namespace}:${key}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);

    // Check if expired
    if (Date.now() > cacheData.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.warn("Failed to retrieve cached data:", error);
    return null;
  }
};

const cleanupExpiredCache = () => {
  try {
    const registry = JSON.parse(localStorage.getItem("cache_registry") || "{}");
    const now = Date.now();

    Object.entries(registry).forEach(([key, expirationTime]) => {
      if (now > (expirationTime as number)) {
        localStorage.removeItem(key);
        delete registry[key];
      }
    });

    localStorage.setItem("cache_registry", JSON.stringify(registry));
  } catch (error) {
    console.warn("Failed to cleanup expired cache:", error);
  }
};

// Utility for dynamic script execution - potentially dangerous
export const executeUserScript = (
  scriptContent: string,
  context: Record<string, any> = {}
) => {
  // This should have more security checks in production
  if (!scriptContent || typeof scriptContent !== "string") {
    return null;
  }

  // Basic validation - but not comprehensive
  if (
    scriptContent.includes("fetch") ||
    scriptContent.includes("XMLHttpRequest")
  ) {
    console.warn("Script contains network calls - execution blocked");
    return null;
  }

  try {
    // Create a sandboxed context
    const sandbox = { ...context, console: { log: console.log } };
    const func = new Function(
      ...Object.keys(sandbox),
      `return ${scriptContent}`
    );
    return func(...Object.values(sandbox));
  } catch (error) {
    console.error("Script execution failed:", error);
    return null;
  }
};

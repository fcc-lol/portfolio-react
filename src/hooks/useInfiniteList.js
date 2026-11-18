import { useState, useEffect, useRef, useCallback } from "react";

export const INITIAL_PROJECT_COUNT = 9;
export const PROJECT_LOAD_INCREMENT = 3;

// Remember how far each list was scrolled so coming back from a project page
// restores the same set of cards instead of collapsing to the first batch.
const rememberedCounts = new Map();

// Reveals a list a few items at a time as a sentinel element nears the
// viewport. Returns the number of items to render and a ref for the sentinel.
export function useInfiniteList(listKey, totalCount) {
  const [visibleCount, setVisibleCount] = useState(
    () => rememberedCounts.get(listKey) || INITIAL_PROJECT_COUNT
  );
  const observerRef = useRef(null);

  useEffect(() => {
    setVisibleCount(rememberedCounts.get(listKey) || INITIAL_PROJECT_COUNT);
  }, [listKey]);

  useEffect(() => {
    rememberedCounts.set(listKey, visibleCount);
  }, [listKey, visibleCount]);

  const hasMore = visibleCount < totalCount;

  const sentinelRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node || !hasMore) return;

      if (typeof IntersectionObserver === "undefined") {
        // No observer support: show everything rather than strand the rest
        setVisibleCount(totalCount);
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setVisibleCount((count) =>
              Math.min(count + PROJECT_LOAD_INCREMENT, totalCount)
            );
          }
        },
        { rootMargin: "300px 0px" }
      );
      observerRef.current.observe(node);
    },
    // visibleCount is a dependency so the sentinel is re-observed after each
    // batch; if it is still on screen the next batch loads straight away.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasMore, totalCount, visibleCount]
  );

  return { visibleCount, hasMore, sentinelRef };
}

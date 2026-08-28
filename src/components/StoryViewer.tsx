import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  PanResponder,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Story } from "../api/types";
import { radius, spacing, typography } from "../theme";

interface StoryViewerProps {
  stories: Story[];
  /** Index to open on; null keeps the viewer closed. */
  startIndex: number | null;
  onClose: () => void;
  onSeen: (newsId: number) => void;
  onReadMore: (newsId: number) => void;
}

/** Matches the web viewer's DURATION so both platforms pace the same. */
const STORY_DURATION_MS = 6000;

/** A downward drag past this many points closes the viewer. */
const SWIPE_CLOSE_DISTANCE = 80;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Top-to-bottom opacities of the fake gradient behind the caption block. */
const SHADE_STEPS = [0, 0.15, 0.32, 0.5, 0.68, 0.82];

/**
 * Fullscreen story viewer: auto-advancing slides with a progress bar per
 * story, tap zones for manual paging and swipe-down to dismiss.
 *
 * The viewer is always mounted by the home screen but renders nothing until
 * `startIndex` is set, so opening a story does not remount the modal.
 */
const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  startIndex,
  onClose,
  onSeen,
  onReadMore,
}) => {
  const visible = startIndex !== null;
  const insets = useSafeAreaInsets();

  const [index, setIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const dragY = useRef(new Animated.Value(0)).current;

  const story = stories[index];

  // `index` is state the timer reads, so advancing from inside the animation
  // callback needs the latest value rather than the one captured at start.
  const indexRef = useRef(index);
  indexRef.current = index;

  const close = useCallback(() => {
    animation.current?.stop();
    dragY.setValue(0);
    onClose();
  }, [onClose, dragY]);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0) {
        // Already on the first story: restart it rather than closing, which
        // would make a mistimed left-tap feel like a dismissal.
        setIndex(0);
        progress.setValue(0);
        return;
      }

      if (next >= stories.length) {
        close();
        return;
      }

      setIndex(next);
    },
    [stories.length, close, progress]
  );

  // Re-seed the index each time the viewer is opened from the rail.
  useEffect(() => {
    if (startIndex !== null) {
      setIndex(startIndex);
    }
  }, [startIndex]);

  // Drive the active slide's progress bar, and advance when it fills.
  useEffect(() => {
    if (!visible || !story) {
      return;
    }

    onSeen(story.news.id);

    progress.setValue(0);
    const runner = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION_MS,
      easing: Easing.linear,
      // The bar animates `width`, which the native driver cannot handle.
      useNativeDriver: false,
    });

    animation.current = runner;
    runner.start(({ finished }) => {
      if (finished) {
        goTo(indexRef.current + 1);
      }
    });

    return () => runner.stop();
  }, [visible, index, story, progress, goTo, onSeen]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Claim the gesture only once it is clearly a vertical drag, so the
        // tap zones keep receiving ordinary presses.
        onMoveShouldSetPanResponder: (_event, gesture) =>
          gesture.dy > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderMove: (_event, gesture) => {
          if (gesture.dy > 0) {
            dragY.setValue(gesture.dy);
          }
        },
        onPanResponderRelease: (_event, gesture) => {
          if (gesture.dy > SWIPE_CLOSE_DISTANCE) {
            close();
            return;
          }

          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
        },
      }),
    [dragY, close]
  );

  if (!visible || !story) {
    return null;
  }

  const caption =
    story.type === "on_this_day"
      ? `${story.news.date_np ?? ""} मा आजको चर्चित`
      : `${story.view_count.toLocaleString("en-US")} पटक हेरिएको`;

  return (
    <Modal visible animationType="fade" onRequestClose={close} statusBarTranslucent>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View style={[styles.container, { transform: [{ translateY: dragY }] }]}>
        <View style={styles.stage} {...panResponder.panHandlers}>
          {story.news.image ? (
            <>
              {/* News photos are landscape, so filling a portrait screen would
                  crop the sides off. Show the whole frame instead, over a
                  blurred blow-up of itself so there are no dead black bars. */}
              <Image
                source={{ uri: story.news.image }}
                style={styles.mediaBackdrop}
                resizeMode="cover"
                blurRadius={25}
              />
              <Image
                source={{ uri: story.news.image }}
                style={styles.media}
                resizeMode="contain"
              />
            </>
          ) : (
            <View style={[styles.media, styles.mediaFallback]} />
          )}

          <View style={styles.scrim} />

          {/* Stacked bands stand in for a bottom gradient, so the headline stays
              readable over a bright photo without a gradient dependency. */}
          <View style={styles.bottomShade} pointerEvents="none">
            {SHADE_STEPS.map((opacity, step) => (
              <View
                key={`shade-${step}`}
                style={[styles.shadeBand, { backgroundColor: `rgba(0,0,0,${opacity})` }]}
              />
            ))}
          </View>

          {/* Tap zones sit under the overlay so the CTA stays tappable. */}
          <Pressable style={[styles.tapZone, styles.tapZoneLeft]} onPress={() => goTo(index - 1)} />
          <Pressable
            style={[styles.tapZone, styles.tapZoneRight]}
            onPress={() => goTo(index + 1)}
          />

          <View
            style={[styles.header, { paddingTop: insets.top + spacing.md }]}
            pointerEvents="box-none"
          >
            <View style={styles.progressRow}>
              {stories.map((item, position) => (
                <View key={`segment-${item.news.id}-${position}`} style={styles.progressTrack}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      position < index && styles.progressFillDone,
                      position === index && {
                        width: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              ))}
            </View>

            <View style={styles.topBar}>
              <Text style={styles.brand}>
                {story.type === "on_this_day" ? "आजकै दिन" : "आजको लोकप्रिय"}
              </Text>
              <TouchableOpacity onPress={close} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons name="close" size={26} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[styles.overlay, { paddingBottom: insets.bottom + spacing.xl }]}
            pointerEvents="box-none"
          >
            <View style={styles.captionRow}>
              <Ionicons
                name={story.type === "on_this_day" ? "time-outline" : "eye-outline"}
                size={14}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.caption}>{caption}</Text>
            </View>

            <Text style={styles.title} numberOfLines={4}>
              {story.news.title}
            </Text>

            {story.news.intro ? (
              <Text style={styles.intro} numberOfLines={3}>
                {story.news.intro}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.cta}
              activeOpacity={0.85}
              onPress={() => {
                animation.current?.stop();
                onReadMore(story.news.id);
              }}
            >
              <Text style={styles.ctaText}>पूरा खबर पढ्नुहोस्</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  stage: {
    flex: 1,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaBackdrop: {
    ...StyleSheet.absoluteFillObject,
    // Blur samples the edge pixels, so the backdrop is scaled past the frame
    // to keep a soft halo from creeping in around the border.
    transform: [{ scale: 1.15 }],
  },
  mediaFallback: {
    backgroundColor: "#2a2f38",
  },
  // Light overall wash: enough to lift the progress bar and close button off a
  // pale photo, but not so much that it flattens the picture itself.
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  bottomShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "58%",
  },
  shadeBand: {
    flex: 1,
  },
  tapZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.32,
  },
  tapZoneLeft: {
    left: 0,
  },
  tapZoneRight: {
    right: 0,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  progressRow: {
    flexDirection: "row",
  },
  progressTrack: {
    flex: 1,
    height: 3,
    marginHorizontal: 2,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "0%",
    backgroundColor: "#ffffff",
  },
  progressFillDone: {
    width: "100%",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  brand: {
    ...typography.label,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  captionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  caption: {
    ...typography.meta,
    color: "rgba(255,255,255,0.85)",
    marginLeft: spacing.xs,
  },
  title: {
    ...typography.hero,
    color: "#ffffff",
  },
  intro: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 24,
    color: "rgba(255,255,255,0.82)",
    marginTop: spacing.sm,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: spacing.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: "#c8102e",
  },
  ctaText: {
    ...typography.label,
    color: "#ffffff",
    marginRight: spacing.xs,
  },
});

export default StoryViewer;

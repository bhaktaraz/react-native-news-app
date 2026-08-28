import React, { useEffect, useMemo } from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import NewsFeed from "../components/NewsFeed";

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

const ArticleListByTagScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id, name } = (route.params ?? {}) as { id?: number | string; name?: string };

  useEffect(() => {
    if (name) {
      navigation.setOptions({ title: `#${name}` });
    }
  }, [navigation, name]);

  const query = useMemo(() => ({ tag: id }), [id]);

  return (
    <NewsFeed
      query={query}
      navigation={navigation}
      emptyTitle="यो ट्यागमा समाचार भेटिएन"
    />
  );
};

export default ArticleListByTagScreen;

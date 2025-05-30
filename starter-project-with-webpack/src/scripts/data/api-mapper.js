import Map from '../utils/map';

export async function storyMapper(story) {
  const placeName = await Map.getPlaceNameByCoordinate(story.lat, story.lon);

  return {
    ...story,
    placeName,
  };
}

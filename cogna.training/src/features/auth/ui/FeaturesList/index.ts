import FeaturesList from "./FeaturesList.vue";
import FeaturesListItem from "./FeaturesListItem.vue";
import FeaturesListItemIcon from "./FeaturesListItemIcon.vue";
import FeaturesListItemTitle from "./FeaturesListItemTitle.vue";
import FeaturesListItemDescription from "./FeaturesListItemDescription.vue";

FeaturesList.Item = FeaturesListItem;
FeaturesList.Item.Icon = FeaturesListItemIcon;
FeaturesList.Item.Title = FeaturesListItemTitle;
FeaturesList.Item.Description = FeaturesListItemDescription;

export default FeaturesList;

import type { ComponentProps, ComponentType } from "react";
import * as Iconsax from "iconsax-react";

type IconProps = ComponentProps<typeof Iconsax.Home2>;

function withDefaults(
  Component: ComponentType<IconProps>,
  name: string,
): ComponentType<IconProps> {
  function Icon(props: IconProps) {
    return (
      <Component
        variant="Linear"
        color="currentColor"
        size="24"
        {...props}
      />
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const Add = withDefaults(Iconsax.Add, "Add");
export const ArrowLeft2 = withDefaults(Iconsax.ArrowLeft2, "ArrowLeft2");
export const ArrowRight2 = withDefaults(Iconsax.ArrowRight2, "ArrowRight2");
export const Calendar = withDefaults(Iconsax.Calendar, "Calendar");
export const CalendarTick = withDefaults(Iconsax.CalendarTick, "CalendarTick");
export const Clock = withDefaults(Iconsax.Clock, "Clock");
export const CloseCircle = withDefaults(Iconsax.CloseCircle, "CloseCircle");
export const DocumentDownload = withDefaults(Iconsax.DocumentDownload, "DocumentDownload");
export const DocumentText1 = withDefaults(Iconsax.DocumentText1, "DocumentText1");
export const Drop = withDefaults(Iconsax.Drop, "Drop");
export const Edit2 = withDefaults(Iconsax.Edit2, "Edit2");
export const Eye = withDefaults(Iconsax.Eye, "Eye");
export const EyeSlash = withDefaults(Iconsax.EyeSlash, "EyeSlash");
export const FilterSearch = withDefaults(Iconsax.FilterSearch, "FilterSearch");
export const HeartTick = withDefaults(Iconsax.HeartTick, "HeartTick");
export const Health = withDefaults(Iconsax.Health, "Health");
export const Home2 = withDefaults(Iconsax.Home2, "Home2");
export const Hospital = withDefaults(Iconsax.Hospital, "Hospital");
export const InfoCircle = withDefaults(Iconsax.InfoCircle, "InfoCircle");
export const Location = withDefaults(Iconsax.Location, "Location");
export const Lock = withDefaults(Iconsax.Lock, "Lock");
export const LogoutCurve = withDefaults(Iconsax.LogoutCurve, "LogoutCurve");
export const Message = withDefaults(Iconsax.Message, "Message");
export const Money3 = withDefaults(Iconsax.Money3, "Money3");
export const Notification = withDefaults(Iconsax.Notification, "Notification");
export const Profile = withDefaults(Iconsax.Profile, "Profile");
export const ProfileCircle = withDefaults(Iconsax.ProfileCircle, "ProfileCircle");
export const SearchNormal1 = withDefaults(Iconsax.SearchNormal1, "SearchNormal1");
export const Sms = withDefaults(Iconsax.Sms, "Sms");
export const Star1 = withDefaults(Iconsax.Star1, "Star1");
export const TickCircle = withDefaults(Iconsax.TickCircle, "TickCircle");
export const User = withDefaults(Iconsax.User, "User");

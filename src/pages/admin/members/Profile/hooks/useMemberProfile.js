import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";

const useMemberProfile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [memberProfile, setMemberProfile] = useState({ user_profile: {} });
  const { mid } = useParams();
  const fetchMemberProfile = async () => {
    try {
      const { status, data } = await axiosInstance.get(
        `/api/user-profile-view/${mid}`
      );
      if (status === 200) {
        setMemberProfile(data.data);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to retrieve data", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchMemberProfile();
  }, []);

  const dispatch = ({ type, payload }) => {
    switch (type) {
      case "UPDATE_COVER": {
        setMemberProfile((prevState) => {
          return {
            ...prevState,
            user_profile: {
              ...prevState.user_profile,
              user_profile: {
                ...prevState.user_profile.user_profile,
                cover_image: payload,
              },
            },
          };
        });
        break;
      }

      case "UPDATE_PROFILE_IMAGE": {
        setMemberProfile((prevState) => {
          return {
            ...prevState,
            user_profile: {
              ...prevState.user_profile,
              user_profile: {
                ...prevState.user_profile.user_profile,
                profile_image: payload,
              },
            },
          };
        });
        break;
      }
    }
  };

  return { memberProfile, fetchMemberProfile, dispatch };
};

export default useMemberProfile;

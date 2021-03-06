import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useMusic } from "lib/music/hook";
import { updateDestinationRoomKey } from "store/actions";

export const useUserAuthorized = () => {
  const { roomKey } = useParams<{ roomKey: string }>();
  const music = useMusic();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!music.isAuthorized()) {
      dispatch(updateDestinationRoomKey(roomKey));
      history.push("/login");
    } else {
      dispatch(updateDestinationRoomKey());
    }
  }, [dispatch, music, history, roomKey]);
};

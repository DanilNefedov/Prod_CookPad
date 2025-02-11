"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/state/hook";
import { fetchUser } from "@/state/slices/user-slice";
import { useSession } from "next-auth/react";

export function ClientUser() {
  const dispatch = useAppDispatch();
  const session = useSession();
  const connection_id = session?.data?.user?.connection_id;

  useEffect(() => {
    if (connection_id) {
      dispatch(fetchUser(connection_id));
    }
  }, [dispatch, connection_id]);

  return null;
}

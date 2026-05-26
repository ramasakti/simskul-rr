import { useEffect } from "react";
import { useNavigation } from "react-router";
import NProgress from "nprogress";

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
});

export function LoadingBar() {
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === "loading") {
            NProgress.start();
        } else {
            NProgress.done();
        }
    }, [navigation.state]);

    return null;
}
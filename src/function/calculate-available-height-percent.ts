export const calculateAvailableHeightPercent = (percent: number): number => {
    return window.screen.availHeight * percent / 100;
}
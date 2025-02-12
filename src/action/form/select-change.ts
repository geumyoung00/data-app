export function SelectChange(
  target: HTMLSelectElement | HTMLInputElement | HTMLDivElement,
  value: string
) {
  if (value) {
    target.parentElement?.classList.remove('init');
  } else {
    return;
  }
}

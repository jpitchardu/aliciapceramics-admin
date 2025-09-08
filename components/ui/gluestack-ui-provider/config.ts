"use client";
import { vars } from "nativewind";

export const config = {
  light: vars({
    /* PRIMARY (Brown) - Actions & Text */
    "--color-primary-50": "251 250 249", // #fbfaf9 - page backgrounds
    "--color-primary-100": "240 231 218", // #f0e7da - form containers
    "--color-primary-800": "42 17 0", // #2a1100 - button pressed states
    "--color-primary-900": "61 25 0", // #3d1900 - main text, buttons

    /* INTERACTIVE (Blue) - Selection & Information */
    "--color-interactive-300": "189 201 203", // rgba(189, 201, 203, 0.3) - info backgrounds
    "--color-interactive-400": "189 201 203", // rgba(189, 201, 203, 0.4) - selection backgrounds
    "--color-interactive-500": "189 201 203", // #bdc9cb - selection borders

    /* INPUT (Pink) - Form States */
    "--color-input-300": "225 175 161", // rgba(225, 175, 161, 0.25) - option backgrounds
    "--color-input-400": "225 175 161", // rgba(225, 175, 161, 0.4) - input backgrounds
    "--color-input-500": "225 175 161", // #e1afa1 - input borders

    /* ALERT (Red) - Focus & Urgency */
    "--color-alert-600": "214 36 17", // #d62411 - required fields, errors

    /* NEUTRAL (Gray) - Support */
    "--color-neutral-50": "255 255 255", // #ffffff - white
    "--color-neutral-200": "232 236 238", // #e8ecee - borders
    "--color-neutral-600": "164 180 183", // #a4b4b7 - disabled text
  }),
  dark: vars({
    /* PRIMARY (Brown) - Actions & Text */
    "--color-primary-50": "251 250 249", // #fbfaf9 - page backgrounds
    "--color-primary-100": "240 231 218", // #f0e7da - form containers
    "--color-primary-800": "42 17 0", // #2a1100 - button pressed states
    "--color-primary-900": "61 25 0", // #3d1900 - main text, buttons

    /* INTERACTIVE (Blue) - Selection & Information */
    "--color-interactive-300": "189 201 203", // rgba(189, 201, 203, 0.3) - info backgrounds
    "--color-interactive-400": "189 201 203", // rgba(189, 201, 203, 0.4) - selection backgrounds
    "--color-interactive-500": "189 201 203", // #bdc9cb - selection borders

    /* INPUT (Pink) - Form States */
    "--color-input-300": "225 175 161", // rgba(225, 175, 161, 0.25) - option backgrounds
    "--color-input-400": "225 175 161", // rgba(225, 175, 161, 0.4) - input backgrounds
    "--color-input-500": "225 175 161", // #e1afa1 - input borders

    /* ALERT (Red) - Focus & Urgency */
    "--color-alert-600": "214 36 17", // #d62411 - required fields, errors

    /* NEUTRAL (Gray) - Support */
    "--color-neutral-50": "255 255 255", // #ffffff - white
    "--color-neutral-200": "232 236 238", // #e8ecee - borders
    "--color-neutral-600": "164 180 183", // #a4b4b7 - disabled text
  }),
};

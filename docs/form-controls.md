# Native form controls

Import `app-stylr/css`, then `app-stylr/controls.css`, and add `data-app-stylr-controls` to the product root. Supply visible labels and product-owned layout. Inputs and selects use a 44px minimum height, 14px horizontal inset, and a separate 44px chevron allowance. Font size stays at 16px to avoid mobile focus zoom.

Light mode follows `data-app-stylr-theme="light"`. Optional compact spacing uses `data-app-stylr-density="compact"`; coarse-pointer devices keep 44px controls. Native options remain keyboard and screen-reader operated. The CSS progressively enhances the picker through `appearance: base-select`; unsupported browsers retain their system menu. Do not promise identical open-option padding across all operating systems. Test closed and open controls, keyboard focus, disabled and invalid states, long values, zoom, and phone layout in the actual consumer.

No JavaScript, storage, network calls, or component framework is included. This is an optional visual recipe, not a shared application component library.

See the [platform behavior documented by MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select).

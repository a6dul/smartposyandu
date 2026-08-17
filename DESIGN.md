---
name: SmartPosyandu
colors:
  surface: '#f8f9ff'
  surface-dim: '#d1dbec'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dfe9fa'
  surface-container-highest: '#d9e3f4'
  on-surface: '#121c28'
  on-surface-variant: '#3f4941'
  inverse-surface: '#27313e'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7a71'
  outline-variant: '#bec9bf'
  surface-tint: '#006d42'
  primary: '#006a40'
  on-primary: '#ffffff'
  primary-container: '#268456'
  on-primary-container: '#f6fff5'
  inverse-primary: '#7ed9a3'
  secondary: '#0060ac'
  on-secondary: '#ffffff'
  secondary-container: '#68abff'
  on-secondary-container: '#003e73'
  tertiary: '#95414a'
  on-tertiary: '#ffffff'
  tertiary-container: '#b45861'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9af6be'
  primary-fixed-dim: '#7ed9a3'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#005230'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a4c9ff'
  on-secondary-fixed: '#001c39'
  on-secondary-fixed-variant: '#004883'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000e'
  on-tertiary-fixed-variant: '#7b2c36'
  background: '#f8f9ff'
  on-background: '#121c28'
  surface-variant: '#d9e3f4'
typography:
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  button-text:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  touch-target-min: 56px
  gutter-md: 1.5rem
  margin-page: 2rem
  stack-gap: 1rem
---

## Brand & Style

This design system is built upon the principles of **Empathetic Accessibility** and **Community Trust**. Designed specifically for Indonesian community health volunteers (*Kader Posyandu*), the aesthetic prioritizes high legibility and physical ease of interaction to accommodate users in the 40-57 age demographic.

The style is **Modern & Nurturing**, blending a clean, professional corporate structure with soft, organic elements. It avoids the coldness of many clinical applications by using a warm, high-contrast palette and realistic imagery that reflects the local community. The interface should feel like a helpful digital companion—reliable, patient, and easy to navigate.

## Colors

The palette is rooted in a **Soft Green** primary hue, symbolizing health, growth, and the natural environment familiar to Indonesian communities. A **Soft Blue** secondary color is used for instructional elements and data visualization, providing a calming contrast.

- **Primary (Sage Green):** Used for primary actions, branding, and progress indicators.
- **Secondary (Sky Blue):** Used for informational accents and secondary navigation.
- **Background (Porcelain White):** A slightly off-white base to reduce eye strain during long data entry sessions.
- **Surface (Clean White):** Pure white used for cards and interactive inputs to pop against the background.
- **Text (Charcoal):** A high-contrast dark grey, rather than pure black, to ensure maximum readability without being harsh.

## Typography

This design system utilizes **Atkinson Hyperlegible Next** for all levels of the hierarchy. This font was specifically designed for readers with visual impairments, making it ideal for middle-aged users who may experience age-related farsightedness (*presbyopia*).

Key typographic rules:
- **Enlarged Defaults:** The standard body size is 18px (Body-md), significantly larger than standard 14px or 16px layouts.
- **High Contrast:** All text must meet WCAG AA standards against its background.
- **Line Spacing:** Generous line-height (minimum 1.5x) prevents lines of text from blurring together.
- **Hierarchy:** Clear distinction between headers and body text using bold weights to guide the eye through Indonesian medical terminology.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a heavy emphasis on vertical stacking to minimize horizontal eye tracking. 

- **Touch-First Philosophy:** A minimum touch target of 56px is enforced for all interactive elements to accommodate varying levels of manual dexterity.
- **Content Density:** Low density is preferred. Every page should have a singular focus (e.g., "Input Berat Badan" or "Daftar Bayi") to avoid cognitive overload.
- **Padding:** Containers use generous internal padding (min 24px) to ensure text does not feel cramped.
- **Breakpoints:** While fluid, the layout optimizes for 7-inch to 10-inch tablets, which are commonly used in field health posts, while remaining fully responsive for smartphones.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layers** and **Ambient Shadows**. This approach creates a "tactile" feel that helps users understand what is interactive.

- **Soft Shadows:** Interactive cards use a low-opacity, diffused green-tinted shadow (6% opacity) to appear "lifted" from the porcelain background.
- **Layering:** Backgrounds are slightly muted, while active work surfaces (cards/modals) are bright white. 
- **Focus States:** Active input fields use a thick 3px border in the secondary blue color, providing unmistakable feedback on where the user is currently typing.

## Shapes

The shape language is consistently **Rounded (Level 2)**. Sharp corners are avoided to maintain a friendly, approachable, and "safe" health-related environment.

- **Buttons & Inputs:** Use a 0.5rem (8px) corner radius.
- **Large Cards:** Use a 1rem (16px) corner radius.
- **Icon Containers:** Use circular or highly rounded backgrounds to make them feel like "badges" of honor for the volunteers.

## Components

### Buttons (Tombol)
- **Primary:** Large, full-width blocks with white text on the primary green background.
- **Secondary:** Outlined buttons with a 2px stroke for less urgent actions like "Kembali" (Back) or "Batal" (Cancel).
- **Labels:** Always use clear, action-oriented Indonesian verbs (e.g., "Simpan Data," "Tambah Anak").

### Cards (Kartu Informasi)
- Cards are the primary container for patient data. 
- Every card must include a clear icon (e.g., a scale for weight) to allow for quick scanning without reading every label.

### Form Inputs (Isian Data)
- **Labels:** Positioned above the field, never inside as placeholder text.
- **Size:** Extra-tall input fields (64px height) to make selection effortless.
- **Keyboard:** Numeric inputs should automatically trigger a large numeric keypad for entering weights and measurements.

### Icons & Visuals
- **Health Icons:** Use thick-stroke, friendly illustrations. A mother and baby icon should be realistic and culturally appropriate for Indonesia.
- **Visual Feedback:** Use large, green checkmarks for successful data entry ("Data Berhasil Disimpan") to give volunteers a sense of accomplishment.

### Penimbangan
- **Single Focus:** The penimbangan screen should feel like one task only: record the latest weight and height.
- **Clear Header:** Use a prominent headline such as "Pencatatan Penimbangan" and a supporting subtitle like "Masukkan berat badan dan tinggi anak untuk pembaruan data.".
- **Input Fields:** Provide two large numeric fields: "Berat Badan (kg)" and "Tinggi Badan (cm)". Each field should be at least 64px tall, with clear labels above and a placeholder of `0.0` or `0`.
- **Touch-first Controls:** The save action should be a full-width primary button with a green background, labeled "Simpan Penimbangan".
- **Minimal Distraction:** Hide secondary navigation or non-essential details while the user is entering data.
- **Confirmation:** After save, show a card summary with the recorded values and a success state such as "Penimbangan berhasil disimpan".

### Navigation
- A simple bottom navigation bar with large icons and text labels for the three core areas: **Beranda** (Home), **Data Anak** (Child Data), and **Laporan** (Reports).
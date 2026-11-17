Radio de esquina:

| Corner radius | Usage |
| ----- | ----- |
| 8px | Top-level containers such as app windows, flyouts and dialogs are rounded using an 8px corner radius. |
| 4px | In-page elements such as buttons and list backplates are rounded using a 4px corner radius. UI elements shaped like bars or lines use a 4px corner radius.  |
| 0px | Straight edges that intersect with other straight edges are not rounded. |
| 0px | Window corners are not rounded when windows are snapped or maximized. |

Experience feels softer and decluttered; it fades into the background to help stay calm and focused. The experience feels warm, ethereal, and approachable. Interface adapts seamlessly to the way users use the app. It bends and flexes to individual needs and preferences.Style balances a new, fresh look. There is no learning curve; Users can pick it up and go. User experience is seamless and does not get in the way of the user's task, it accompanies it.

Use of elements:

- [Color](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/color): Use color to establish hierarchy, communicate meaning, and create a cohesive visual identity..  
- [Commanding](https://learn.microsoft.com/en-us/windows/apps/design/basics/commanding-basics): Present actions in clear, consistent patterns that help users understand what they can do.  
- [Elevation](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/layering): Apply depth and layering to guide focus and reinforce the structure of your interface.  
- [Geometry](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/geometry): Use shape, sizing, and spatial relationships to create balanced, predictable layouts.  
- [Haptics](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/haptics)  
  Add touch feedback to reinforce user input and create more responsive, intuitive interactions.  
- [Iconography](https://learn.microsoft.com/en-us/windows/apps/design/iconography/) Communicate actions and concepts quickly with familiar, purposeful icons.  
- [Layout](https://learn.microsoft.com/en-us/windows/apps/design/layout/): Organize content with grids, spacing, and alignment patterns that improve clarity and flow.  
- [Materials](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/materials): Enhance your UI with Fluent materials like Mica and Acrylic to add depth and warmth.  
- [Motion](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/motion): Use motion to provide feedback, guide attention, and create smooth, responsive interactions.  
- [Navigation](https://learn.microsoft.com/en-us/windows/apps/design/basics/navigation-basics): Help users move through the app with predictable, well-structured navigation patterns.  
- [Typography](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/typography): Set the tone and improve readability with consistent type choices and hierarchy.  
- [Usability](https://learn.microsoft.com/en-us/windows/apps/design/usability/): Ensure the app is easy to use through intuitive interactions, clear affordances, and accessibility.  
- [Widgets](https://learn.microsoft.com/en-us/windows/apps/design/widgets/): Extend your app with glanceable, interactive surfaces that surface key information and actions.  
- [Writing](https://learn.microsoft.com/en-us/windows/apps/design/style/writing-style): Use clear, concise, and helpful spanish language to improve understanding and reduce cognitive load.

The app supports two color modes, or themes: light and dark. Each mode consists of a set of neutral color values that are automatically adjusted to ensure optimal contrast. The app can use a light or dark theme, which affects the colors of the app's background, text, icons, and [common controls](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/). In both light and dark color modes, darker colors indicate background surfaces of less importance. Important surfaces are highlighted with lighter and brighter colors.

Accent color var(--accent) is used to emphasize important elements in the UI and to indicate the state of an interactive object or control. Accent color values are generated automatically and optimized for contrast in both light and dark modes. Accent colors are used sparingly to highlight important elements and convey information about an interactive element's state

Make sure that elements and images have sufficient contrast to differentiate between them, regardless of the accent color or theme. Accessibility should be a primary concern. Use the guidance below to make sure your application is accessible to as many users as possible.

*Command elements* are interactive UI elements that let users perform actions such as sending an email, deleting an item, or submitting a form. *Command interfaces* are composed of common command elements, the command surfaces that host them, the interactions they support, and the experiences they provide.

Using the right elements in a command interface can make the difference between an intuitive, easy-to-use app and a difficult, confusing app. Here's a list of some of the most common command elements.

- Buttons: Buttons trigger an immediate action.  
- Lists: Lists present items in an interactive list or a grid. Usually used for many options or display items. Examples include drop-down list, list box, list view and grid view.  
- Selection controls: Lets users choose from a few options, such as when completing a survey or configuring app settings.   
- Calendar, date and time pickers: Calendar, date and time pickers enable users to view and modify date and time info, such as when creating an event or setting an alarm.   
- Predictive text entry: Provides suggestions as users type, such as when entering data or performing queries.

Always try to let users manipulate content directly rather than through commands that act on the content, such as dragging and dropping to rearrange list items rather than up and down command buttons.

Here's a list of some of the most common command surfaces:

- App canvas (content area): If a command is constantly needed for users to complete core scenarios, put it on the canvas. Because you can put commands near (or on) the objects they affect, putting commands on the canvas makes them easy and obvious to use. However, choose the commands you put on the canvas carefully. Too many commands on the app canvas take up valuable screen space and can overwhelm the user. If the command won't be frequently used, consider putting it in another command surface.  
- Command bars and menu bars: Command bars help organize commands and make them easy to access. Command bars can be placed at the top of the screen, at the bottom of the screen, or at both the top and bottom of the screen.  
- Menus and context menus: Menus and context menus save space by organizing commands and hiding them until the user needs them. Users typically access a menu or context menu by clicking a button or right-clicking a control.

Command feedback communicates to users that an interaction or command was detected, how the command was interpreted and handled, and whether the command was successful or not. This helps users understand what they've done, and what they can do next. Ideally, feedback should be integrated naturally in the UI, so users don't have to be interrupted, or take additional action unless absolutely necessary. Provide feedback only when necessary and only if it's not available elsewhere. Keep the application UI clean and uncluttered unless you are adding value.

Here are some ways to provide feedback in the app:

- Flyouts: [Flyouts](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/dialogs-and-flyouts/) are lightweight contextual popups that can be dismissed by tapping or clicking somewhere outside the flyout.  
- Dialog controls: [Dialog controls](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/dialogs-and-flyouts/) are modal UI overlays that provide contextual app information. In most cases, dialogs block interactions with the app window until being explicitly dismissed, and often request some kind of action from the user. Dialogs can be disruptive and should only be used in certain situations. 

Be careful of how much your app uses confirmation dialogs; they can be very helpful when the user makes a mistake, but they are a hindrance whenever the user is trying to perform an action intentionally.

Hierarchy communicates important information about how to navigate within an app while keeping the user's attention focused on the most important content. Layering and elevation are powerful visual cues that modernize experiences and help them feel coherent.

This app uses layering and elevation as its foundation for app hierarchy. Hierarchy communicates important information about how to navigate within an app while keeping the user's attention focused on the most important content. Layering and elevation are powerful visual cues that modernize experiences and help them feel coherent within Windows.

Elevation is the depth component of the spatial relationship one surface has to another with respect to their position on the desktop. When two or more objects occupy the same location on the screen, only the object with the highest elevation will be rendered at that location.

Shadows and contour (outlines) are used on controls and surfaces to subtly communicate an object's elevation, and to help draw focus where needed within an experience. The app uses the following values to express elevation with shadow and contour.

Window  
Elevation value: 128  
Stroke width: 1

Dialog  
Elevation value: 128  
Stroke width: 1

Flyout  
Elevation value: 32  
Stroke width: 1

Tooltip  
Elevation value: 16  
Stroke width: 1

Card  
Elevation value: 8  
Stroke width: 1

Control  
Elevation value: 2  
Stroke width: 1

Layer  
Elevation value: 1  
Stroke width: 1

Controls vary their elevation and contour to indicate state. The intensity of the rendered shadow changes depending on the theme at parity of value.

Rest  
Elevation value: 2  
Stroke width: 1

Hover  
Elevation value: 2  
Stroke width: 1

Pressed  
Elevation value: 1  
Stroke width: 1

Layering is the concept of overlapping one surface with another, creating two or more visually distinguished areas within the same application. The app uses a two-layer system for applications. These two layers create hierarchy and provide clarity, keeping users focused on what's most important.

* The base layer is an app's foundation. It is the bottommost layer of every app, and contains controls related to app menus, commands, and navigation.  
* The content layer focuses the user on the app's central experience. The content layer may be on contiguous element, or separated into cards that segment content.

Shadows are a key visual cue that reinforces the concept of elevation. When a surface is elevated above another, it casts a shadow on the layer beneath it. The higher the elevation, the larger and softer the shadow becomes. This relationship between elevation and shadow helps users intuitively understand the spatial hierarchy of your app's interface.

Shadows work together with contour (outlines) to communicate depth. Standard controls like flyouts, dialogs, and tooltips already include appropriate shadows based on their elevation values. Using shadows purposefully, rather than decoratively, ensures they remain an effective signal for drawing focus to the most important elements.

Haptics add a sense of touch to digital interactions, making experiences feel more responsive and intuitive. While most digital interfaces rely on visual or auditory feedback alone, haptic feedback provides a physical confirmation that reinforces user input and creates a clearer, more immediate connection between action and response.

This app provides a set of predefined haptic waveforms designed for common interaction patterns. Each waveform has a distinct feel and purpose, helping create consistent experiences across applications and devices.

Waveforms are defined by three characteristics:

| Characteristic | Description |
| ----- | ----- |
| Intensity | How strong the feedback feels. |
| Decay | How quickly the feedback fades. |
| Sharpness | The character of the feedback, ranging from soft to crisp. |

### Interaction feedback waveforms

These waveforms provide feedback *during* an interaction.

| Waveform | API constant | Description |
| ----- | ----- | ----- |
| Hover | Hover | A light pulse that indicates hover states, signaling an upcoming action. |
| Collide | Collide | A soft pulse that indicates reaching a boundary or limit. |
| Align | Align | A sharp pulse when an object snaps to an alignment guide. |
| Step | Step | A firm pulse for discrete changes, such as moving through steps or values. |
| Grow | Grow | A dynamic pulse that conveys motion, transitions, or intelligent system activity. |

### 

### Process confirmation waveforms

These waveforms communicate the outcome of a *completed* action.

| Waveform | API constant | Description |
| ----- | ----- | ----- |
| Success | Success | An ascending pattern that confirms a completed action. |
| Error | Error | A descending pattern that indicates a failed action. |

Haptics should feel like a natural part of an interaction—not a distraction. Use them to reinforce user input, not to add decoration. The following principles guide when and how to use haptics effectively.

### 

### 1\. Establish a clear cause–effect relationship

Haptic feedback should be a reliable response to user input. Reserve it for user-initiated actions to create a clear, intuitive connection. Delays weaken that connection—aim for latency under 50 ms between the triggering event and feedback delivery.

### 

### 2\. Provide signals, not noise

Not every interaction needs feedback. Use haptics where they add value. The following patterns represent common scenarios where haptics improve clarity:

| Scenario | Purpose | Trigger | Recommended waveform |
| ----- | ----- | ----- | ----- |
| Object alignment | Indicate when an object aligns to the edge or center of another object. | Cursor snaps to an alignment guide while moving or resizing. | Align |
| Drop target | Indicate that an item can be dropped at the current location. | Dragging an item over a valid drop target. | Click (Hover) |
| Slider detent | Indicate discrete steps or values within a range. | Control reaches a step or snaps to a value. | Step |
| Screen edge | Indicate that a boundary has been reached. | Dragging a window to the edge of the screen to activate Snap. | Collide |

### 

### Provide haptics consistently

Apply haptics consistently across similar interactions so users can build an understanding of what each signal represents. Use each waveform for its intended purpose and avoid mixing patterns for the same interaction type.

## 

## Spacing and gutters

The use of consistently sized spacing and gutters semantically groups an experience into separate components. These values map to our rounded corner logic and together help create a cohesive and usable layout.

8epx between buttons

8epx between buttons and flyouts

8epx between control and header

12epx between control and label

12epx between content areas

16epx between surface and edge text

Using Title, Subtitle and Body with 12epx spacing.

When differentiating a title in a confined UI space, use Body Strong for the title without any additional spacing between text blocks.

Use caption size for very confined spaces where text is needed, such as command buttons.

There are a variety of list and grid styles that can be created.

For multi-line lists, use Body and Caption from the type ramp, and 32epx icons.

Use Body Strong for section headers.

When using icons or person picture elements for grid items, use Caption text that is center-aligned.

Use Body style for primary text and left-align to the image if your list contains large graphical elements with text.

# 

# Materials in this app

Materials are visual effects applied to UX surfaces that resemble real life artifacts. This app uses two primary types of materials: occluding and transparent. Occluding materials, like *acrylic* and *mica*, are used as base layers beneath interactive UI controls. Transparent materials such as *smoke*are used to highlight immersive surfaces.

Acrylic is a semi-transparent material that replicates the effect of frosted glass. Acrylic is used only for transient, light-dismiss surfaces such as flyouts and context menus. Acrylic is mode aware; it supports both light and dark mode.

* Use background acrylic for transient UI elements.

For apps with context menus, flyouts, non-modal popups, or light-dismiss panes, use background acrylic. Using acrylic in transient scenarios helps maintain a visual relationship with the content that triggered the transient UI. Use in-app acrylic for supporting UI, such as on surfaces that may overlap content when scrolled or interacted with. Don't put acrylic on large background surfaces of your app. Don't place multiple acrylic panes next to each other because this results in an undesirable visible seam. Don't place accent-colored text over acrylic surfaces.

Design acrylic material starting with translucency, blur, and noise to add visual depth and dimension to flat surfaces. Add an exclusion blend mode layer to ensure contrast and legibility of UI placed on an acrylic background. Finally, we add color tint for personalization opportunities. In concert these layers add up to a fresh, usable material.

[Mica](https://learn.microsoft.com/en-us/windows/apps/design/style/mica) is a opaque material. Mica surfaces are subtly tinted with the background color. Apply Mica material as the base layer of the app, and prioritize visibility in the title bar area. 

Smoke emphasizes an important UI surface by dimming the surfaces beneath so that they recede into the background. Smoke is used to signal blocking interaction below a modal UI such as a dialog. Smoke is not mode aware; it is always translucent black in both light and dark mode.

# Motion in this app

Motion describes the way the interface animates and responds to user interaction. Motion in this app is reactive, direct, and context appropriate. It provides feedback to user input and reinforces spatial paradigms that support way-finding.

These principles guide the use of motion in the app

### Connected: Elements of actions connect seamlessly

Elements that change position and size should visually connect from one state to another, even if they aren't connected under the hood. Users are guided to follow elements going from point to point, lowering the cognitive load of static state changes.

### Consistent: Elements should behave in similar ways when sharing entry points

Surfaces that share the same UI entry point should invoke and dismiss the same way to bring consistency to interactions. Each transition should respect the timing, easing, and direction of other elements so a surface feels cohesive.

### Delightful: Unexpected moments of joy with purpose

Motion adds personality and energy to the experience in order to transform simple actions into moments of delight. These moments are always brief and fleeting, and help reinforce user actions.

iming and easing curves are adjusted based on the purpose of the animation to create a coherent experience.

| Purpose | Definition | Ease | Timing | Used For |
| ----- | ----- | ----- | ----- | ----- |
| Direct Entrance | Fast – In | Cubic-bezier(0,0,0,1) | 167, 250, 333 | Position, Scale, Rotation |
| Existing Elements | Point to Point | Cubic-bezier(0.55,0.55,0,1) | 167, 250, 333ms | Position, Scale, Rotation |
| Direct Exit | Fast – Out | Cubic-bezier(0,0,0,1) | 167ms | Position, Scale, Rotation (ALWAYS combine with fade out) |
| Gentle Exit | Soft – Out | Cubic-bezier(1,0,1,1) | 167ms | Position, Scale |
| Bare Minimum | Fade – In \+ Out | Linear | 83ms | Opacity |
| Strong Entrance | Elastic In (3 Keyframes) | (3 values below) | (3 values below) | Position, Scale |
|  | Keyframe 1 | Cubic-Bezier(0.85, 0, 0, 1\) | 167ms |  |
|  | Keyframe 2 | Cubic-Bezier(0.85, 0, 0.75, 1\) | 167ms |  |
|  | Keyframe 3 | Cubic-Bezier(0.85, 0, 0, 1\) | 333ms |  |

#### 

#### Page Transition: Page-to-page transitions within the same surface

Use [page transitions](https://learn.microsoft.com/en-us/windows/apps/develop/motion/page-transitions) to transition smoothly from page to page, and configure animation directions to respect the flow of an app. Page transitions guide your user's eyes to incoming and outgoing content, lowering cognitive load.

Connected Animation: Layer-to-layer transitions within the same page

Use connected animations to highlight specific pieces of information within a page or surface, while retaining context. Connected animations give focus to selected elements, and seamlessly transition between the focused and non-focused states.

#### 

#### Animated Icon: Adds delight and reveals information through micro interactions

Use [animated icons](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/animated-icon) to implement lightweight, vector-based icons and illustrations with motion. Animated icons draw attention to specific entry points, provide feedback from state to state, and add delight to an interaction.

| ThemeResource Name | Value |
| ----- | ----- |
| ControlNormalAnimationDuration | 250ms |
| ControlFastAnimationDuration | 167ms |
| ControlFasterAnimationDuration | 83ms |

Easing is a way to manipulate the velocity of an object as it travels. The easing used in the system helps unify the physical feel of objects moving throughout the system. These easings will help achieve a more natural feel.

Fast Out, Slow In: cubic-bezier(0, 0, 0, 1\)

Use for objects or UI entering the scene, either navigating or spawning​.

Once on-scene, the object is met with extreme friction, which slows the object to rest.​ The resulting feel is that the object traveled from a long distance away and entered at an extreme velocity, or is quickly returning to a rest state.​ Even if it's preceded by a moment of unresponsiveness, the velocity of the incoming object has the effect of feeling fast and responsive.​

Slow Out, Fast In: cubic-bezier(1 , 0 , 1 , 1\)

Use for UI or objects that are exiting the scene.

Objects become powered and gain momentum until they reach escape velocity.​ The resulting feel is that the object is trying its hardest to get out of the user's way and make room for new content to come in.​

## Principles of good navigation

Let's start with the basic principles of good navigation design:

* Consistency: Meet user expectations.  
* Simplicity: Don't do more than you need to.  
* Clarity: Provide clear paths and options.

Navigation should be consistent with user expectations. Using [standard controls](https://learn.microsoft.com/en-us/windows/apps/design/basics/navigation-basics#use-the-right-controls) that users are familiar with and following standard conventions for icons, location, and styling will make navigation predictable and intuitive for users.

Fewer navigation items simplify decision making for users. Providing easy access to important destinations and hiding less important items will help users get where they want, faster.

Clear paths allow for logical navigation for users. Making navigation options obvious and clarifying relationships between pages should prevent users from getting lost.

* Think about the users. Trace out typical paths they might take through the app, and for each page, think about why the user is there and where they might want to go.  
* Avoid deep navigation hierarchies. If you go beyond two levels of navigation, provide a breadcrumb bar that shows the user where they are and lets them quickly get back out.   
* Avoid "pogo-sticking." Pogo-sticking occurs when there is related content, but navigating to it requires the user to go up a level and then down again.

## Using Segoe Fluent Variable

Segoe UI Variable is the main font for this app. It supports two axes for finer control of text: weight and optical size.

* The weight axis (wght) is incremental with weights from Thin (100) to Bold (700).

| Weight name | Weight axis value |
| ----- | :---: |
| Light | 300 |
| Semilight | 350 |
| Regular | 400 |
| Semibold | 600 |
| Bold | 700 |

| Attribute | Value | Notes |
| ----- | ----- | ----- |
| Weight | Regular, Semibold | Use regular weight for most text, use Semibold for titles |
| Alignment | Left, Center | Align left by default, Align center only in rare cases such as text below icons |
| Minimum values | 14px Semibold, 12px Regular | Text smaller than these sizes and weights are illegible in some languages |
| Casing | Sentence case | Use sentence casing for all UI text, including titles |
| Truncation | Ellipses and clipping | Use ellipses in most cases; clipping is only used in rare cases |

This type ramp establishes crucial relationships between the type styles on a page, helping users read content easily. All sizes are in effective pixels.

| Weight | Size/line height |
| ----- | ----- |
| Small | 12/16 epx |
| Text | 14/20 epx |
| Text semibold | 14/20 epx |
| Text | 18/24 epx |
| Text semibold | 18/24 epx |
| Display semibold | 20/28 epx |
| Display semibold | 28/36 epx |
| Display semibold | 40/52 epx |
| Display semibold | 68/92 epx |

### 

### Character count: Keep to 50–60 letters per line for ease of reading. Don't use fewer than 20 characters or more than 60 characters per line as this is difficult to read.

## 

## Steps for inclusive design

Apply these seven steps to keep inclusive design actionable throughout development.

1. Establish inclusive design as a product requirement, and align design decisions to real user outcomes.  
2. Prefer framework-provided controls where possible to maximize built-in accessibility support and reduce custom maintenance cost.  
3. Design a logical hierarchy that defines standard controls, custom controls, and keyboard focus behavior in the UI.  
4. Build support for core system behaviors (such as keyboard navigation, high contrast, and high DPI) into the product architecture.


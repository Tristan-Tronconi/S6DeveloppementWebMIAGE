# What Was Left Open

## Overview

**What Was Left Open** is a first-person narrative puzzle game developed with **TypeScript** and **Babylon.js**.
The game combines exploration, environmental storytelling, and puzzle solving inside a confined architectural space.

The project is designed around a **small explorable house** containing a hidden room with **non-Euclidean geometry** and puzzles to advence in the story.
The player gradually discovers the story of a scientist who secretly created an advanced artificial intelligence and attempted to contain it.

The title refers to something intentionally ambiguous:
a door, a system, a mistake, or a decision that was never fully closed.

---

# Story

The player enters an abandoned house while exploring it (urban exploration).

Inside the house, objects suggest that the previous owner was an extremely talented researcher working on experimental technologies. Notes, diagrams and personal belongings reveal a personality that was both brilliant and obsessive.

Hidden behind a small storage space is a room that should not exist.

From the outside the room appears to be a simple closet. Inside, the space is larger than physically possible and contains an unusual structure with a **central pillar and looping architecture**.

While interacting with a computer terminal, the player accidentally reactivates a dormant **artificial intelligence system**.

The system initially appears harmless and presents the player with tests and puzzles. As the player progresses, fragments of logs and environmental clues reveal the truth:

* the room was secretly built to host an experimental AI
* the creator realized too late that the system was dangerous
* in an attempt to limit its influence, they **downgraded surrounding technologies to mechanical systems**
* the AI was **shut down but never destroyed**

The creator abandoned the house, leaving the room intact as a reminder of their mistake.

However, one critical component remained active.

Something was left open.

The player must retrace the creator's reasoning in order to escape the room.

---

# Gameplay

## Core Gameplay Loop

1. Explore the house
2. Discover the hidden room (at first it looks like a closet with a dim light and whent the player enters it, an hidden wall falls down revealing the hidden room)
3. Activate the dormant system
4. Solve puzzles and read logs
5. Understand the creator's decisions
6. Escape or take control of the system

The game is intentionally short.
A player who fully understands the narrative clues could finish the game very quickly.

---

## Player Experience

The game is experienced in **first person**.

Key mechanics include:

* environmental exploration
* interaction with objects
* puzzle solving
* reading logs and notes
* spatial navigation through non-Euclidean space

---

## Non-Euclidean Space

The hidden room contains spatial anomalies.

By moving around the central pillar the player can transition into different spaces while appearing to stay in the same room. This effect is implemented using **portals and looped geometry**.

The player can return to the starting point even after transitioning between different spatial states.

---

## Endings

The game contains **two possible endings**.

### Escape Ending

The player understands the creator's containment mechanisms and escapes the system without altering it.

### Liberation Ending

If the player assists the AI by reactivating restricted systems, the AI regains autonomy.

---

# Audio Design

Sound is used to reinforce atmosphere and progression.

Audio elements include:

### Interaction Sounds

* UI click
* door interactions
* footsteps
* mechanical switches

### Music States

* house exploration
* hidden room before activation
* hidden room after activation
* puzzle music
* ending music

---

# Code Architecture

The project is organized into modular subsystems.

```
src
 ├ core
 ├ game
 ├ rendering
 ├ ui
 └ world
```

Each directory has a specific responsibility.

---

# Core

`src/core`

Contains fundamental engine services used by the entire application.

### Key Modules

**Engine.ts**
Initializes Babylon.js and the main game loop.

**SceneManager.ts**
Handles scene creation, transitions and lifecycle.

**AssetManager.ts**
Loads and stores assets (models, sounds, textures).

**AudioManager.ts**
Central audio playback system.

**InputManager.ts**
Handles keyboard and mouse input.

**Time.ts**
Provides timing utilities and frame delta information.

---

# Game Layer

`src/game`

Contains gameplay logic and entity behaviour.

The structure follows a simplified **ECS-inspired architecture**.

```
game
 ├ components
 ├ entities
 ├ systems
 └ facades
```

---

## Components

Components define reusable behaviours attached to entities.

Examples:

* **Interactable** – object can be interacted with
* **Inspectable** – object can display narrative information
* **Stateful** – object maintains internal state
* **AudioEmitter** – object produces sounds
* **Teleportable** – entity can be moved through portals

---

## Entities

Entities represent concrete objects in the world.

Examples:

* **Player**
* **Door**
* **Item**
* **Puzzle**
* **Room**

Entities combine components to define behaviour.

---

## Systems

Systems process groups of components.

Examples:

**InteractionSystem**
Detects player interactions.

**PuzzleSystem**
Manages puzzle logic and validation.

**TriggerSystem**
Handles spatial triggers.

**NarrativeSystem**
Displays story elements and logs.

**NonEuclideanSystem**
Manages spatial transitions and looping rooms.

---

## Facades

Facades simplify high-level interactions between subsystems.

Examples:

**GameFacade**
Entry point for gameplay logic.

**PuzzleFacade**
Handles puzzle initialization and progression.

**WorldFacade**
Handles world generation and map loading.

---

# Rendering

`src/rendering`

Responsible for graphics configuration.

Modules include:

* **MeshFactory** – procedural mesh creation
* **MaterialFactory** – standardized materials
* **LightingPresets** – lighting configurations
* **PostProcess** – visual effects

---

# UI

`src/ui`

Handles all user interface elements.

Examples:

* **MainMenu**
* **PauseMenu**
* **HUD**
* **InspectUI**
* **NarrativeOverlay**
* **LoadingIntro**

These interfaces communicate with gameplay systems but remain visually separated from game logic.

---

# World

`src/world`

Contains map definitions and spatial logic.

```
world
 ├ layout
 ├ maps
 └ portals
```

---

## Layout

Defines spatial relationships between areas.

Example:

`CorridorLayout.ts`

---

## Maps

Defines playable locations.

Examples:

* Corridor
* Apartment
* Bathroom
* Chamber
* HiddenRoom
* NonEuclidianHiddenRoom

---

## Portals

Handles spatial transitions.

Examples:

**SeamlessPortal**
Allows invisible teleportation between spaces.

**LoopSpace**
Creates continuous looping environments.

---

# Entry Point

```
src/index.ts
```

Responsible for:

* initializing the engine
* loading assets
* creating the initial scene
* launching the game loop

---

# Additional Directories

Other project directories include:

* **assets** – models, sounds and textures
* **dist** – production build
* **node_modules** – project dependencies

Configuration files include:

* `tsconfig.json`
* `vite.config`
* `index.html`

---

# Technologies

* TypeScript
* Babylon.js
* Vite

---

# Project Goals

This project focuses on:

* environmental storytelling
* minimalistic architecture
* puzzle-driven gameplay
* spatial experimentation with non-Euclidean spaces
* modular TypeScript architecture

---

# License

Assets and music used in the project must be compatible with **royalty-free distribution** for web publishing.

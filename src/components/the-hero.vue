<template>
    <div class="hero" :style="{ backgroundColor: image.commonColor }" @click="chooseNewImage">
        <div class="hero-image">
            <img :src="image.path" @load="onImageLoaded" :style="{ top: isImageLoading ? '-100%' : '0' }" />
        </div>
        <div class="hero-text">
            <h2 class="months" :class="{ disabled: !monthsRemaining }">
                <span>{{ monthsRemaining }}</span> month{{ monthsRemaining !== 1 ? 's' : '' }}
            </h2>
            <h2 class="weeks" :class="{ disabled: !monthsRemaining && !weeksRemaining }">
                <span>{{ weeksRemaining }}</span> week{{ weeksRemaining !== 1 ? 's' : '' }}
            </h2>
            <h2 class="days" :class="{ disabled: !monthsRemaining && !weeksRemaining && !daysRemaining }">
                <span>{{ daysRemaining }}</span> day{{ daysRemaining !== 1 ? 's' : '' }}
            </h2>
            <h2 class="hours" :class="{ disabled: !monthsRemaining && !weeksRemaining && !daysRemaining && !hoursRemaining }">
                <span>{{ hoursRemaining }}</span> hour{{ hoursRemaining !== 1 ? 's' : '' }}
            </h2>
            <h2 class="minutes" :class="{ disabled: !monthsRemaining && !weeksRemaining && !daysRemaining && !hoursRemaining && !minutesRemaining }">
                <span>{{ minutesRemaining }}</span> minute{{ minutesRemaining !== 1 ? 's' : '' }}
            </h2>
            <h2
                class="seconds"
                :class="{ disabled: !monthsRemaining && !weeksRemaining && !daysRemaining && !hoursRemaining && !minutesRemaining && !secondsRemaining }"
            >
                <span>{{ secondsRemaining }}</span> second{{ secondsRemaining !== 1 ? 's' : '' }}
            </h2>
            <div class="description" :style="{ backgroundColor: image.commonColor }">
                <p>...until {{ dateString }}</p>
                <p>
                    <em>{{ image.description }}</em> by {{ image.author }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import imageLibrary from '../assets/image-library.json';

const interval = ref(0);
const isImageLoading = ref(true);

// Target date: April 29th, 2025
const targetDate = new Date('2025-04-29T00:00:00').getTime();
// const targetDate = new Date('2025-02-21T14:00:00').getTime();

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;

const timeRemaining = ref(-1);
const monthsRemaining = computed(() => Math.max(Math.floor(timeRemaining.value / month), 0));
const weeksRemaining = computed(() => Math.max(Math.floor((timeRemaining.value % month) / week), 0));
const daysRemaining = computed(() => Math.max(Math.floor(((timeRemaining.value % month) % week) / day), 0));
const hoursRemaining = computed(() => Math.max(Math.floor((timeRemaining.value % day) / hour), 0));
const minutesRemaining = computed(() => Math.max(Math.floor((timeRemaining.value % hour) / minute), 0));
const secondsRemaining = computed(() => Math.max(Math.floor((timeRemaining.value % minute) / second), 0));

const dateString = computed(() => {
    const month = new Date(targetDate).toLocaleString('default', { month: 'long' });
    const day = new Date(targetDate).getDate();
    return month + ' ' + day;
});

const imageIndex = ref(0);
const nextImageIndex = ref(0);
chooseNewImage();

function chooseNewImage() {
    if (isImageLoading.value) return;
    nextImageIndex.value = imageIndex.value;
    while (nextImageIndex.value === imageIndex.value) nextImageIndex.value = Math.floor(Math.random() * imageLibrary.length);
    console.log(`Choosing new image: ${imageIndex.value} -> ${nextImageIndex.value}`);
    isImageLoading.value = true;
    setTimeout(() => {
        imageIndex.value = nextImageIndex.value;
    }, 500);
}

function onImageLoaded() {
    console.log('Image loaded');
    setTimeout(() => {
        console.log(`Image transitioned: ${imageIndex.value} -> ${nextImageIndex.value}`);
        imageIndex.value = nextImageIndex.value;
        isImageLoading.value = false;
    }, 1000);
}

const image = computed(() => {
    return imageLibrary[imageIndex.value];
});

onMounted(() => {
    interval.value = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
    // Clear the interval when the component is unmounted
    clearInterval(interval.value);
});

function updateCountdown() {
    const now = new Date().getTime();
    timeRemaining.value = targetDate - now;
}
</script>

<style lang="scss" scoped>
.hero {
    width: 100%;
    height: 100vh;
    transition: background-color 0.5s;

    position: relative;

    .hero-text,
    .hero-image {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .hero-text {
        display: flex;
        flex-direction: column;
        padding-top: 1.2rem;

        h2 {
            padding: 0 1.2rem;
            font-size: 12rem;
            font-style: bold;
            font-family: 'Oswald', sans-serif;
            text-transform: uppercase;
            line-height: 0.9;
            color: white;
            text-shadow: 0.8rem 0.8rem 0 black;
        }

        .description {
            padding: 1.2rem;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-top: auto;
            transition: background-color 0.5s;

            p {
                font-size: 2rem;
                font-family: 'Roboto Slab', serif;
                color: white;
                text-shadow: 0.2rem 0.2rem 0 black;
                height: min-content;

                &:first-child {
                    white-space: nowrap;
                }

                &:last-child {
                    text-align: right;
                    > em {
                        display: block;
                    }
                }
            }
        }
    }

    .hero-image {
        img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: top 0.5s;
        }
    }
}

.disabled {
    opacity: 0.4;
    text-shadow: none !important;
}

// Tablets
@media (max-width: 1200px) {
    .hero > .hero-text {
        > h2 {
            font-size: 12rem;
        }
        > .description > p {
            font-size: 1.6rem;
        }
    }
}

// Phones
@media (max-width: 768px) {
    .hero > .hero-text {
        > h2 {
            font-size: 5.2rem;
            text-shadow: 0.4rem 0.4rem 0 black;
            line-height: 1;
        }
        > .description {
            align-items: flex-start;
            flex-direction: column;
            > p {
                font-size: 2.4rem;
                &:last-child {
                    text-align: left;
                    font-size: 1.6rem;
                }
            }
        }
    }
}
</style>

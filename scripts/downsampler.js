/****************************************************************************
 * downSampler.js
 * openacousticdevices.info
 * May 2022
 *****************************************************************************/

'use strict';

/* Debug constant */

const DEBUG = false;

/* File buffer constants */

const HERTZ_IN_KILOHERTZ = 1000;

/* Valid sample rate */

const validSampleRates = [8000, 16000, 32000, 48000, 96000, 192000, 250000, 384000];

/* Greatest common divisor function */

function greatestCommonDivider(a, b) {

    var c;

    while (a != 0) {
        c = a; 
        a = b % a;  
        b = c;
    }

    return b;

}

/* Downsample an input array */

function downsample (inputArray, originalSampleRate, outputArray, requestedSampleRate) {

    /* Check parameters */

    let originalSampleRateValid = false;
    let requestedSampleRateValid = false;

    for (let i = 0; i < validSampleRates.length; i += 1) {

        if (originalSampleRate === validSampleRates[i]) originalSampleRateValid = true;

        if (requestedSampleRate === validSampleRates[i]) requestedSampleRateValid = true;

    }

    /* Return if there is a problem with the parameters */

    let valid = originalSampleRateValid && requestedSampleRateValid && requestedSampleRate <= originalSampleRate;

    if (!valid) {

        const message = !originalSampleRateValid ? "Original sample rate is not valid." :
                        !requestedSampleRateValid ? "Requested sample rate is not valid." :
                        "Requested sample rate is greater than original sample rate";

        return {
            success: false,
            length: 0,
            error: message
        };
    
    }

    /* Calculate the downsampling parameters */

    const sampleRateDivider = Math.ceil(originalSampleRate / requestedSampleRate);

    const rawSampleRate = sampleRateDivider * requestedSampleRate;

    const step = originalSampleRate / rawSampleRate;

    /* Calculate the number of samples to read and write */

    const gcd = greatestCommonDivider(originalSampleRate / HERTZ_IN_KILOHERTZ, requestedSampleRate / HERTZ_IN_KILOHERTZ);

    const divider = originalSampleRate / HERTZ_IN_KILOHERTZ / gcd;

    const multiplier = requestedSampleRate / HERTZ_IN_KILOHERTZ / gcd;

    const length = Math.floor(inputArray.length / divider) * multiplier;

    /* Output summary */

    if (DEBUG) {

        console.log("Downsampler input: " + inputArray.length + " samples at " + originalSampleRate + " Hz");

        console.log("Downsampler output: " + length + " samples at " + requestedSampleRate + " Hz");

    }

    /* Finish early if no data is to be written */

    if (length == 0) {

        return {
            success: true,
            length: 0,
            error: null
        };

    }

    /* Write the data */
            
    let count = 0;

    let total = 0;

    let position = 0;

    let inputIndex = 0;

    let outputIndex = 0;

    let currentSample = 0;

    let nextSample = inputArray[inputIndex++];

    while (outputIndex < length) {

        /* Read next sample */

        currentSample = nextSample;

        nextSample = inputArray[inputIndex++];

        /* Interpolate until a new sample is required */

        while (position < 1.0 && outputIndex < length) {

            const interpolatedSample = currentSample + position * (nextSample - currentSample);

            total += interpolatedSample;

            count += 1;

            /* Write a new output sample */

            if (count == sampleRateDivider) {

                outputArray[outputIndex++] = Math.round(total / sampleRateDivider);

                total = 0;

                count = 0;

            }

            position += step;

        }

        position -= 1.0;

    }

    /* Finish */

    return {
        success: true,
        length: length,
        error: null
    };

}

/* Export downsample */

exports.downsample = downsample;
/****************************************************************************
 * sampleRateControl.js
 * openacousticdevices.info
 * May 2022
 *****************************************************************************/

const sampleRateHolder = document.getElementById('sample-rate-holder');
const disabledSampleRateHolder = document.getElementById('disabled-sample-rate-holder');

const sampleRateLabels = document.getElementsByName('sample-rate-label');
const sampleRateRadios = document.getElementsByName('sample-rate-radio');
const disabledSampleRateRadios = document.getElementsByName('disabled-sample-rate-radio');

const possibleSampleRates = [8000, 16000, 32000, 48000, 96000, 192000, 250000, 384000];

/**
 * Swap disabled sample rate UI for enabled one
 */
function enableSampleRateControl () {

    sampleRateHolder.style.display = '';
    disabledSampleRateHolder.style.display = 'none';

}

/**
 * Swap enabled sample rate UI for disabled one
 */
function disableSampleRateControl () {

    sampleRateHolder.style.display = 'none';
    disabledSampleRateHolder.style.display = '';

}

/**
 * Update the UI to reflect the limits of the current sample rate (target sample rate can only be <= true sample rate)
 * @param {number} sampleRate Sample rate of the current file
 */
function updateSampleRateUI (sampleRate) {

    for (let i = 0; i < possibleSampleRates.length; i++) {

        if (possibleSampleRates[i] > sampleRate) {

            sampleRateRadios[i].disabled = true;
            sampleRateLabels[i].classList.add('grey');

        } else {

            sampleRateRadios[i].disabled = false;
            sampleRateLabels[i].classList.remove('grey');

        }

        sampleRateRadios[i].checked = sampleRate === possibleSampleRates[i];

        disabledSampleRateRadios[i].checked = sampleRate === possibleSampleRates[i];

    }

}

/**
 * @returns The sample rate currently selected from the available options
 */
function getSampleRateSelection () {

    return possibleSampleRates[parseInt(document.querySelector('input[name="sample-rate-radio"]:checked').value, 10)];

}

/**
 * Apply event listeners to sample rate UI
 * @param {function} listener Function called when radio is clicked
 */
function addSampleRateUIListeners (listener) {

    for (let i = 0; i < sampleRateRadios.length; i++) {

        sampleRateRadios[i].addEventListener('click', () => {

            // Match hidden sample rate radios which are only displayed when UI is disabled

            disabledSampleRateRadios[i].checked = true;

            // Run provided function

            listener();

        });

    }

}

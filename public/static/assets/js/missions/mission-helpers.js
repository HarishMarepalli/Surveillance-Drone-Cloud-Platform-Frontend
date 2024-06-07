var COLOR_SCHEMES = []
var COLOR_COUNTER = 0


// Helpers

function getByValue(object, value) {
    return Object.keys(object).find(objKey => object[objKey] === value)
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function getColor(h) {
    function HSLToRGB(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [255 * f(0), 255 * f(8), 255 * f(4)];
    };

    return [HSLToRGB(h, 100, 50), HSLToRGB(h, 30, 30)]
}

function getMissionModeController() {
    function getMissionMode() {
        return missionMode
    }

    function setMissionMode(newMode) {
        missionMode = newMode
    }

    return {
        get: getMissionMode,
        set: setMissionMode
    }
}

function getMissionUpdateURL(id) {
    return `/missions/${id}/edit/`
};

function validationError(element, error, message) {
    // console.log('validationError', element, error, message)
    let hintIcon = element.siblings('i')
    if (error === false) {
        element.removeClass('validation-fail-input')
        hintIcon.tooltip('hide')
        hintIcon.remove()
        return
    }

    if (hintIcon.length > 0) {
        if (hintIcon.attr('data-original-title') !== message) {
            hintIcon.attr('data-original-title', message)
        }
        return
    }

    element.addClass('validation-fail-input')
    hintIcon = $('<i class="fas fa-light fa-circle-question validation-icon-hint"></i>')
    hintIcon.attr({
        'data-toggle': 'tooltip',
        'data-placement': 'top',
        'data-original-title': message,
    })
    hintIcon.tooltip()
    element.after(hintIcon)
}

function validateHeading(element, value) {
    return validateField([
        [isNumber],
        [isInteger],
        [betweenValues, [-180, 180]],
    ], element, value)
}

function validatePositiveNumber(element, value, isInt=false) {
    let validators = [
        [isEmpty],
        [isNumber],
        [isPositive],
    ]
    if (isInt)
        validators.push([isInteger])
    return validateField(validators, element, value)
}

function validateBetweenNumber(element, value, max, min, isInt=false) {
    let validators = [
        [isEmpty],
        [isNumber],
        [betweenValues, [max, min]],
    ]
    if (isInt)
        validators.push([isInteger])
    return validateField(validators, element, value)
}

function validateField(validators, element, value) {
    for (let [validator, args] of validators) {
        if (!args)
            args = []
        const result = validator(element, value, ...args)
        if (!result) {
            return false
        }
    }
    validationError(element, false)
    return true
}

function betweenValues(target, value, min, max) {
    if (value < min || value > max) {
        validationError(target, true, `The value must be between ${min} and ${max}`)
        return false
    }
    return true
}

function isNumber(target, value) {
    if (isNaN(Number(value))) {
        validationError(target, true, 'The value must be a number')
        return false
    }
    return true
}

function isInteger(target, value) {
    if (!Number.isInteger(Number(value))) {
        validationError(target, true, 'The value must be an integer')
        return false
    }
    return true
}

function isPositive(target, value) {
    if (value < 0) {
        validationError(target, true, 'The value must be positive')
        return false
    }
    return true
}

function isEmpty(target, value) {
    if (value === '') {
        validationError(target, true, 'The value must not be empty')
        return false
    }
    return true
}

function initColorSchemes() {
    const colors = [
        [Cesium.Color.fromCssColorString/*('#E5F9DB')*/('#70BEEB'), Cesium.Color.fromCssColorString('#A2A378')],
        [Cesium.Color.fromCssColorString('#C4DFDF'), Cesium.Color.fromCssColorString('#E3F4F4')],
        [Cesium.Color.fromCssColorString('#FFB84C'), Cesium.Color.fromCssColorString('#A459D1')],
        [Cesium.Color.fromCssColorString('#9376E0'), Cesium.Color.fromCssColorString('#F3BCC8')],
        [Cesium.Color.fromCssColorString('#884A39'), Cesium.Color.fromCssColorString('#FFC26F')],
        [Cesium.Color.fromCssColorString('#F1C27B'), Cesium.Color.fromCssColorString('#A2CDB0')],
        [Cesium.Color.fromCssColorString('#FF9B9B'), Cesium.Color.fromCssColorString('#FFD6A5')],
        [Cesium.Color.fromCssColorString('#78C1F3'), Cesium.Color.fromCssColorString('#E2F6CA')],
        [Cesium.Color.fromCssColorString('#FAF0E4'), Cesium.Color.fromCssColorString('#FF8551')],
        [Cesium.Color.fromCssColorString('#22A699'), Cesium.Color.fromCssColorString('#F29727')],
    ]

    // Colors
    const defaultColors = {
        pointActive: Cesium.Color.DIMGREY,
        outlineActive: Cesium.Color.GAINSBORO,
        errorActive: Cesium.Color.RED,
        errorPassive: Cesium.Color.RED,
        groundPoint: {
            active: Cesium.Color.fromBytes(90, 90, 90, 30),
            passive: Cesium.Color.fromBytes(197, 197, 197, 30),
        },
        text: {
            active: Cesium.Color.WHITE,
            passive: Cesium.Color.BLACK,
        }
    }

    for (const [main, roi] of colors) {
        let colorScheme = {
            default: {
                main: main,
                ...defaultColors,
            },
            roi: {
                main: roi,
                ...defaultColors,
            },
        }
        COLOR_SCHEMES.push(colorScheme)
    }
}

(function() {
    initColorSchemes()
})()

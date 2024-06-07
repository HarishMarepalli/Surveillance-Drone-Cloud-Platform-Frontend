var __viewer

function cesiumCreateViewer(element_id) {
    // Init cesium
    Cesium.Ion.defaultAccessToken = CESIUM_ACCESS_TOKEN;
    __viewer = new Cesium.Viewer(element_id, {
        sceneMode: Cesium.SceneMode.SCENE3D,
        baseLayerPicker: true,
        fullscreenButton: false,
        timeline: true,
        animation: false,
        vrButton: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        geocoder: true,
        selectionIndicator: true,
        shadows: true,
        infoBox: false,
        // targetFrameRate: 24,
        terrainProvider: Cesium.createWorldTerrain({
            requestVertexNormals: true
        }),
        // imageryProvider: new Cesium.OpenStreetMapImageryProvider({
        //     url: 'https://a.tile.openstreetmap.org/'
        // }),
    });

    // Hide underground entities
    __viewer.scene.globe.depthTestAgainstTerrain = true;

    // Start viewer clock with system time
    __viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;

    // Remove default behavior
    __viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    __viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return __viewer
}


function utils_getGlobeHeight(lon, lat) {
    var cartographic = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), 0)
    const height = __viewer.scene.globe.getHeight(cartographic)
    if (height === undefined)
        return 0
    return height
}

function utils_correctAlt(lon, lat, offset) {
    offset = offset ? offset : 0

    var globeHeight = utils_getGlobeHeight(lon, lat)
    if (globeHeight && globeHeight > 0) {
        return globeHeight + offset
    } else {
        return offset
    }
}

function getCartesianFromMovement(position) {
    var ray = __viewer.camera.getPickRay(position);
    var cartesian = __viewer.scene.globe.pick(ray, __viewer.scene);

    return cartesian
}

function utils_getLonLatAltFromCartesian(cartesian) {
    var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
    var lon = Cesium.Math.toDegrees(cartographic.longitude)
    var lat = Cesium.Math.toDegrees(cartographic.latitude)
    var alt = cartographic.height

    return {lon, lat, alt}
}


function utilChangeDefaultFetureState(feature_state) {
    const url = location.origin + '/api/v2/features/default/update'
    const payload = feature_state

    const h = {
        "Content-Type": "application/json",
        "accept": "application/json",
        "X-CSRFToken": $('input[name=csrfmiddlewaretoken]').first().val()
    }

    fetch(url, {
        method: "PATCH",
        headers: h,
        body: JSON.stringify(payload)
    })
}

class AlertManager {
    constructor() {
        this.alertMain = $('.alert')
        this.previousMessage = {
            status: null,
            text: null,
        }
        this.setupAlert()
    }

    setupAlert() {
        this.alertMain.find('i.fa-xmark').on('click', function() {
            this.alertMain.hide()
        }.bind(this))
    }

    showAlert(text, status, timeout=null) {
        if (text && text !== '') {
            this.alertMain.find('span').text(text)
            this.alertMain.show()
            if (timeout)
                setTimeout(() => {
                    this.previousMessage.text = this.alertMain.text()
                    this.showAlert(this.previousMessage.text, this.previousMessage.status)
                })
        }
    }

    addPointAlert() {
        this.showAlert('Double clicking on the map to add waypoints. Double clicking on waypoint to remove it')
    }

    missionUnhelthyAlert() {

    }
}

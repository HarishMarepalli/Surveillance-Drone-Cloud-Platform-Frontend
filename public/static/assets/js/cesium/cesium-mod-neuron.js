var __cesium_mod_neuron_integration = null

// for lazy access
function get_cesium_mod_neuron_integration() {
    return __cesium_mod_neuron_integration || {}
}

// for initial access
function init_cesium_mod_neuron_integration(viewer) {
    viewer.camera.percentageChanged = 0.3

    var JWTToken = ''
    var sessionID = ''

    var poller_id
    var cleaner_id

    var interval = 1000
    var trail_time = 60
    var delete_timeout = 15 * 1000

    var max_height = 4000

    const heightLimit = 300000
    const maxValueFunction = 1.581988897
    const maxHeight = 8000000 - heightLimit
    
    const limitAngle = 45
    const xOfs = 1
    const yOfs = 0.15

    var cameraPoll = false
    var isHomeSet = false
    const widget = $('.cesium-widget')


    var last_poll = Date.now()
    var min_poll_timedelta = 500  // ms

    var targets = {}

    target_proto = {
        small: {
            model_name: 'small_plane.glb',
            max_model_size: 64
        },
        middle: {
            model_name: 'middle_plane.glb',
            max_model_size: 48
        },
        big: {
            model_name: 'large_plane.glb',
            max_model_size: 82
        }
    }
    
    var target_cetegories = {
        0: {
            name: 'No Information',
            model: target_proto.middle
        },
        1: {
            name: 'Light',
            model: target_proto.small
        },
        2: {
            name: 'Small',
            model: target_proto.middle
        },
        3: {
            name: 'Large',
            model: target_proto.big
        },
        4: {
            name: 'High Vortex Large',
            model: target_proto.big
        },
        5: {
            name: 'Heavy',
            model: target_proto.big
        },
        6: {
            name: 'High Performance',
            model: target_proto.middle
        },
        7: {
            name: 'Rotorcraft',
            model: target_proto.small
        },
        8: {
            name: 'No Information',
            model: target_proto.small
        },
        9: {
            name: 'Glider/sailplane',
            model: target_proto.small
        },
        10: {
            name: 'Lighter-than-Air',
            model: target_proto.small
        },
        11: {
            name: 'Parachutist/Skydiver',
            model: target_proto.small
        },
        12: {
            name: 'Ultralight/hang-glider/paraglider',
            model: target_proto.small
        },
        13: {
            name: 'Reserved',
            model: target_proto.small
        },
        14: {
            name: 'Unmanned Aerial Vehicle',
            model: target_proto.small
        },
        15: {
            name: 'Space/Trans-atmospheric vehicle',
            model: target_proto.small
        },
        16: {
            name: 'No Information',
            model: target_proto.small
        },
        17: {
            name: 'Surface Emergency Vehicle',
            model: target_proto.small
        },
        18: {
            name: 'Surface Service Vehicle',
            model: target_proto.small
        },
        19: {
            name: 'Point Obstacle',
            model: target_proto.small
        },
        20: {
            name: 'Cluster Obstacle',
            model: target_proto.small
        },
        21: {
            name: 'Line Obstacle',
            model: target_proto.small
        },
    }

    class Target {
        constructor(viewer, planeTarget, category) {
            this.planeTarget = planeTarget
            this.groundAltitude = 0
            this.heading = 0
            this.lat = undefined
            this.lon = undefined
            this.groundspeed = undefined
            this.positionCartesian = new Cesium.Cartesian3()
            this.lastUpdate = null
            this.createdTime = Date.now()
            this.category = target_cetegories[Number(category)]

            this.cesiumViewer = viewer
            this.positionSample = new Cesium.SampledPositionProperty()
            // this.positionSample.setInterpolationOptions({
            //     interpolationDegree: 2,
            //     interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
            // });
            this.entities = {}
        }

        update (lat, lon, alt, heading, gorundspeed) {
            if (alt != undefined)
                this.groundAltitude = alt

            if (heading != undefined)
                this.heading = heading

            if (lat == this.lat && lon == this.lon)
                return

            this.lat = lat
            this.lon = lon
            this.groundspeed = gorundspeed

            this.positionCartesian = new Cesium.Cartesian3.fromDegrees(lon, lat, this.groundAltitude)
            this.orientation = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this.heading-90), 0, 0)
            this.orientationTransform = new Cesium.Transforms.headingPitchRollQuaternion(this.positionCartesian, this.orientation)
            const latitude = Cesium.Math.clampToLatitudeRange(Cesium.Math.toRadians(lat));
            const longitude = Cesium.Math.convertLongitudeRange(Cesium.Math.toRadians(lon));
            const cartographic = new Cesium.Cartographic(longitude, latitude, 0.0)
            this.groundPosition = new Cesium.Cartographic.toCartesian(cartographic)
            this.lastUpdate = Date.now()
            this.updateEntity()
        }

        createTargetEntity () {
            this.entities['targetEntity'] = this.cesiumViewer.entities.add({
                show: true,
                position: new Cesium.CallbackProperty(()=>{
                    return this.positionCartesian
                }),
                name: `plane-${this.planeTarget}`,
                orientation: new Cesium.CallbackProperty(()=>{
                    return this.orientationTransform
                }),
                model: {
                    uri: location.origin + '/static/' + this.category.model.model_name,
                    minimumPixelSize: this.category.model.max_model_size,
                }
            })
            this.entities['path'] = viewer.entities.add({
                position: this.positionSample,
                name: `planepath-${this.planeTarget}`,
                path: {
                    show: true,
                    leadTime: 0,
                    trailTime: trail_time,
                    width: 10,
                    resolution: 1,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.3,
                        taperPower: 0.3,
                        color: Cesium.Color.PALEGOLDENROD,
                    })
                },
            })
            this.entities['polyline'] = viewer.entities.add({
                polyline: {
                    positions: new Cesium.CallbackProperty(()=>{
                        return [this.positionCartesian, this.groundPosition]
                    }),
                    width: 5,
                    material: Cesium.Color.fromCssColorString('#14b827'),
                    },
                });
                this.entities['planeLabel'] = viewer.entities.add({
                position: new Cesium.CallbackProperty((time) => {
                    var pos = this.entities['targetEntity'].position.getValue(time)
                    if (pos) {
                        return pos
                    }
                }),
                label: {
                    // This callback updates the length to print each frame.
                    show: true,
                    font: "14px arial",
                    text: new Cesium.CallbackProperty(() => {
                        let label = ""
                        label += `Category: ${this.category.name}\n`
                        label += `Groundspeed: ${this.groundspeed}\n`
                        label += `Ground Alt: ${this.groundAltitude}`
                        return label
                    }),
                    fillColor: Cesium.Color.WHITE,
                    showBackground: true,
                    backgroundColor: Cesium.Color.fromBytes(90, 90, 90, 140),
                    pixelOffset: new Cesium.Cartesian2(50, -45),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    translucencyByDistance: new Cesium.NearFarScalar(25000, 1.0, 25000, 0.0),
                    disableDepthTestDistance: 10,
                    outlineWidth: 3,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                }
            })
        }

        updateEntity () {
            this.positionSample.addSample(this.cesiumViewer.clock.currentTime, this.positionCartesian)
            if (!$.isEmptyObject(this.entities)) {
                return
            }
            this.createTargetEntity()
        }

        isActive () {
            if (Date.now() - this.lastUpdate > delete_timeout) {
                return false
            }
            return true
        }

        delete () {
            for (const [name, entity] of Object.entries(this.entities)) {
                this.cesiumViewer.entities.remove(entity)
            }
        }
    }

    function updateTargetPosition (target) {
        function getPlaneSafety(targetID, category) {
            if (targets[targetID]){
                return targets[targetID]
            }
            const target = new Target(viewer, targetID, category)
            targets[targetID] = target
            return target
        }
    
        // If get negative altitude, skip this target. Maybe if the target is on the ground
        if (target.gAltitude < 0) return
    
        const targetObj = getPlaneSafety(target.targetID, target.targetCategory)
        targetObj.update(target.latitude, target.longitude, target.gAltitude, target.heading, target.groundspeed)
    }

    function getJWTtoken () {
        let url = location.origin + '/api/v2/integrations/neuron/get_token/'
        const request = new XMLHttpRequest()
        request.open('GET', url, false)
        request.send(null);
        if (request.status === 200) {
            return JSON.parse(request.responseText)
        } else {
            console.error("Couldn't get JWT access token")
            return {}
        }
    }

    function getSessionID (token) {
        let url = location.origin + '/api/v2/integrations/neuron/get_session/?key=' + token
            const request = new XMLHttpRequest();
        request.open('GET', url, false)
        request.send(null);
        if (request.status === 200) {
            return JSON.parse(request.responseText)
        } else {
            console.error("Couldn't get session")
            return {}
        }
    }

    async function getByRadius (token, session_id, lat, lon) {
        if (Date.now() - last_poll < min_poll_timedelta) return
        const url = location.origin + `/api/v2/integrations/neuron/radius_poll/?session_id=${session_id}&token=${token}&lat=${lat}&lon=${lon}`

        const resp = await fetch (url)
        last_poll = Date.now()
        return resp
    }


    function checkActiveTargets (force=false) {
        for (const [id, target] of Object.entries(targets)) {
            if (!target.isActive() || force) {
                target.delete()
                delete targets[id]; 
            }
        }
    }

    function initNeuron () {
        if (!JWTToken)
            JWTToken = getJWTtoken()['access_token']
        if (!sessionID)
            sessionID = getSessionID(JWTToken)['session_id']
    }

    function targetPollingInLocation (lat, lon, radius=5000, ceiling=10000) {
        initNeuron()

        if (poller_id)
            clearInterval(poller_id)

        poller_id = setInterval(function(){
            getByRadius(JWTToken, sessionID, lat, lon, radius, ceiling)
                .then(responce => {
                    if (responce === undefined)
                        return null

                    if (responce.status == 401) {
                        JWTToken = getJWTtoken()
                        return []
                    } 
                    return responce.json()
                }).then(data => {
                    if (data === null)
                        return

                    for (let tid = 0; tid < data.targets.length; tid++) {
                        updateTargetPosition(data.targets[tid])
                    }
                })
            checkActiveTargets()
        }, interval)
    }

    function targetPollOneshot (lat, lon, radius=5000, ceiling=10000) {
        initNeuron()

        getByRadius(JWTToken, sessionID, lat, lon, radius, ceiling)
            .then(responce => {
                if (responce === undefined)
                    return null

                if (responce.status == 401) {
                    JWTToken = getJWTtoken()
                    return []
                }
                return responce.json()
            }).then(data => {
                if (data === null)
                    return

                for (let tid = 0; tid < data.targets.length; tid++) {
                    updateTargetPosition(data.targets[tid])
                }
            })
    }

    function maxHeightAngle(height) {
        // A shifted inverse square function that limits the camera angle and implements a soft convergence to zero
        const radiansAngle = Cesium.Math.toRadians(limitAngle)
        if (height < 0)
            height = 0
        if (height > maxHeight)
            height = maxHeight
        const translatedValue = maxValueFunction * height / maxHeight
        return radiansAngle * (1 / (translatedValue + xOfs) ** 2 - yOfs) / (1 - yOfs)
    }

    function rotateAroundVector(directVector, rotationVector, rotationAngle) {
        const dx = Math.sqrt(directVector.y ** 2 + directVector.z ** 2)

        const xAxisAngle = directVector.y < 0 ? -Cesium.Math.acosClamped(directVector.z/dx) : Cesium.Math.acosClamped(directVector.z/dx)
        const yAxisAngle = directVector.x > 0 ? -Cesium.Math.acosClamped(dx) : Cesium.Math.acosClamped(dx)

        var rotX = Cesium.Matrix3.fromRotationX(xAxisAngle)
        var rotY = Cesium.Matrix3.fromRotationY(yAxisAngle)
        var rotZ = Cesium.Matrix3.fromRotationZ(rotationAngle)

        var rotatedPoint = rotationVector.clone()
        Cesium.Matrix3.multiplyByVector(rotX, rotatedPoint, rotatedPoint)
        Cesium.Matrix3.multiplyByVector(rotY, rotatedPoint, rotatedPoint)
        Cesium.Matrix3.multiplyByVector(rotZ, rotatedPoint, rotatedPoint)
        Cesium.Matrix3.multiplyByVector(Cesium.Matrix3.fromRotationY(-yAxisAngle), rotatedPoint, rotatedPoint)
        Cesium.Matrix3.multiplyByVector(Cesium.Matrix3.fromRotationX(-xAxisAngle), rotatedPoint, rotatedPoint)

        return rotatedPoint
    }

    function cameraCenterCords() {
        const cameraCords = viewer.camera.positionCartographic
        return {
            lat: Cesium.Math.toDegrees(cameraCords.latitude),
            lon: Cesium.Math.toDegrees(cameraCords.longitude)
        }
    }
    
    function translatePosition(pos) {
        if (!pos)
            return cameraCenterCords()
        let cords = Cesium.Cartographic.fromCartesian(pos)
        const height = viewer.scene.globe.getHeight(pos)
        const cameraCartographicPosition = viewer.camera.positionCartographic.clone()

        // If we are below the limited height, set the point of interest as the current camera point
        if (height + max_height > cameraCartographicPosition.height)
            return cameraCenterCords()
    
        // Take the normal to the globe relative to the camera
        let cameraCartographic = viewer.camera.positionCartographic.clone()
        cameraCartographic.height = 0
        const earthCenterPos = Cesium.Cartographic.toCartesian(cameraCartographic)
        const earthCenterPosDiff = Cesium.Cartesian3.subtract(earthCenterPos, viewer.camera.position, new Cesium.Cartesian3)
        const normEarthCenterPosDiff = Cesium.Cartesian3.normalize(earthCenterPosDiff, new Cesium.Cartesian3)
    
        // Take the normal to the viewer center point
        const centralViewerPosDiff = Cesium.Cartesian3.subtract(pos, viewer.camera.position, new Cesium.Cartesian3)
        const normCentralViewerPosDiff = Cesium.Cartesian3.normalize(centralViewerPosDiff, new Cesium.Cartesian3)
    
        const scalarAngle = Cesium.Cartesian3.dot(normEarthCenterPosDiff, normCentralViewerPosDiff)
        const angle = Cesium.Math.acosClamped(scalarAngle)
    
        const maxAngle = maxHeightAngle(cameraCartographicPosition.height)
    
        if (angle > maxAngle) {
            var rotVector = Cesium.Cartesian3.cross(normEarthCenterPosDiff, normCentralViewerPosDiff, new Cesium.Cartesian3)
            Cesium.Cartesian3.normalize(rotVector, rotVector)
    
            const rotatedDirection = rotateAroundVector(rotVector, normEarthCenterPosDiff, maxAngle)
            const rotatedRay = new Cesium.Ray(viewer.camera.position, rotatedDirection)
            const marginalPoint = viewer.scene.globe.pick(rotatedRay, viewer.scene)
    
            if (marginalPoint === undefined)
                return cameraCenterCords()
    
            cords = Cesium.Cartographic.fromCartesian(marginalPoint)
        }
        return {
            lat: Cesium.Math.toDegrees(cords.latitude),
            lon: Cesium.Math.toDegrees(cords.longitude)
        }
    }

    function getCentralViewerPosition() {
        const height = widget.outerHeight()
        const width = widget.outerWidth()
        const cart2 = new Cesium.Cartesian2(width/2|0, height/2|0)
        const centerRay = viewer.camera.getPickRay(cart2)
        if (!centerRay) return
        const globalPos = viewer.scene.globe.pick(centerRay, viewer.scene)
        return globalPos
    }

    function onCameraChanged() {
        const globalPos = getCentralViewerPosition()
        point = translatePosition(globalPos)
        targetPollOneshot(point.lat, point.lon)
    }

    function onCameraStoped() {
        const globalPos = getCentralViewerPosition()
        point = translatePosition(globalPos)
        targetPollingInLocation(point.lat, point.lon)
    }

    function startIntegration(lat, lon) {
        if (lat && lon) {
            isHomeSet = true
            cameraPoll = false
            targetPollingInLocation(lat, lon)
        } else {
            isHomeSet = false
            cameraPoll = true
            const globalPos = getCentralViewerPosition()
            point = translatePosition(globalPos)
            targetPollingInLocation(point.lat, point.lon)
            onCameraStoped()
        }
        switchCameraListeners()

        cleaner_id = setInterval(checkActiveTargets(), 1000)
    }

    function switchCameraListeners(disable=false) {
        if (disable) {
            viewer.camera.changed.removeEventListener(onCameraChanged)
            viewer.camera.moveEnd.removeEventListener(onCameraStoped)
            return
        }

        if (cameraPoll)
            viewer.camera.changed.addEventListener(onCameraChanged)
        else
            viewer.camera.changed.removeEventListener(onCameraChanged)

        if (isHomeSet)
            viewer.camera.moveEnd.removeEventListener(onCameraStoped)
        else
            viewer.camera.moveEnd.addEventListener(onCameraStoped)
    }

    function stopIntegration() {
        clearInterval(cleaner_id)
        clearInterval(poller_id)
        switchCameraListeners(true)
        checkActiveTargets(true)
    }

    function homePoll(lat, lon) {
        cameraPoll = false
        isHomeSet = true
        switchCameraListeners()
        targetPollingInLocation(lat, lon)
    }

    function homeDeletePoll() {
        cameraPoll = true
        isHomeSet = false
        switchCameraListeners()
        onCameraStoped()
    }

    function updatePoll() {
        switchCameraListeners()
    }

    return __cesium_mod_neuron_integration = {
        startIntegration: startIntegration,
        stopIntegration: stopIntegration,
        targetPollingInLocation: targetPollingInLocation,
        homePoll: homePoll,
        homeDeletePoll: homeDeletePoll,
        updatePoll: updatePoll,
        checkActiveTargets: checkActiveTargets,
    }
}

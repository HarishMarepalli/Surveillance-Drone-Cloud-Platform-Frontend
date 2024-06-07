(function () {
    var dragging_point;

    const aletManager = new AlertManager()
    aletManager.addPointAlert()

    missionMode = ''
    const missionModeController = getMissionModeController()

    var isNeuronFeature = $('#is_neuron').prop('checked')

    // Create viewer
    /*
    if (missionId != "")
    {
        // fetch mission content from backend
        fetch(`${BASE_URL}/api/getMissionPlanContentById/${missionId}`)
            .then(response => response.json())
            .then(data => {
            
            console.log("mission " + missionId + " content " + data.content);
            const missionDataScript = document.getElementById('mission-data');
            if (missionDataScript) {
                missionDataScript.textContent = data.content;
                console.log("found missionDataScript " + missionDataScript.textContent);
            }
        })
    }
    */
    var viewer = cesiumCreateViewer('cesiumContainer')

    // Create handler
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // console.log("Create mission manager")
    // console.log("global var access", MISSION_MODE, serviceType, droneId)
    // Init cesium class mission manager
    var cesiumMissionManager = new MissionManager(viewer, missionModeController, aletManager, MISSION_THUMBNAIL)

    if (MISSION_MODE === 'update') {
        missionModeController.set('view')
        cesiumMissionManager.domManager.lockMenu(true)
    } else if (MISSION_MODE === 'create') {
        missionModeController.set('edit')
        cesiumMissionManager.domManager.lockMenu(false)
    }

    // Init Neuron integration
    var cesium_mod_neuron = init_cesium_mod_neuron_integration(viewer)

    // Select entity
    handler.setInputAction(function (movement) {
        var pickedObject = viewer.scene.pick(movement.position);

        if (Cesium.defined(pickedObject)) {
            var pickedObjectName = pickedObject.id.name + ""
            if (!pickedObject.id.properties)
                return
            const entityProps = pickedObject.id.properties.getValue()
            if (entityProps?.itemId === undefined)
                return

            let currentItemId = entityProps.itemId

            if (pickedObjectName === 'betweenPoint') {
                if (missionMode != 'view')
                    cesiumMissionManager.addPoint('middleWaypoint', undefined, undefined, currentItemId)
            } else if (pickedObjectName === 'loiterCyl') {
                if (missionMode != 'view')
                    cesiumMissionManager.changeLoiterClockwise(currentItemId)
            } else if (pickedObjectName !== undefined) {
                cesiumMissionManager.selectedPointId = currentItemId
                cesiumMissionManager.selectDomItem(currentItemId)
            }
        } else {
            cesiumMissionManager.selectedPointId = -1
            cesiumMissionManager.selectDomItem(undefined)
            // TODO Select active roi if available
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // Add handler to add/remove entity
    handler.setInputAction(function (movement) {
        if (missionMode != 'view') {
            var pickedObject = viewer.scene.pick(movement.position);

            if (Cesium.defined(pickedObject)) {
                const pickedObjectName = pickedObject.id.name + ""
                if (['groundPoint', 'altPoint'].includes(pickedObjectName)) {
                    // REMOVE
                    if (!pickedObject.id.properties)
                        return
                    const entityProps = pickedObject.id.properties.getValue()
                    cesiumMissionManager.removePoint(entityProps.itemId)
                }
            } else {
                // ADD
                var cartesian = getCartesianFromMovement(movement.position)

                if (cartesian) {
                    var {lon, lat} = utils_getLonLatAltFromCartesian(cartesian)

                    cesiumMissionManager.addPoint('simple', lat, lon)

                    if (isNeuronFeature) {
                        cesium_mod_neuron.homePoll(lat, lon) // TODO
                    }
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    // Drag start
    handler.setInputAction(function (movement) {
        if (missionMode != 'view') {
            var pickedObject = viewer.scene.pick(movement.position);

            if (Cesium.defined(pickedObject)) {
                const pickedObjectName = pickedObject.id.name
                if (pickedObjectName) {
                    // console.log('pickedObject', pickedObjectName)

                    if (['groundPoint', 'altPoint', 'loiterCyl'].includes(pickedObjectName)) {
                        dragging_point = pickedObject
                        viewer.scene.screenSpaceCameraController.enableRotate = false;
                    }
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // Drag end
    handler.setInputAction(function () {
        if (dragging_point) {
            const entityProps = dragging_point.id.properties.getValue()
            if (dragging_point.id.name === 'groundPoint') {
                cesiumMissionManager.endMoveGroundPosition(entityProps.itemId)
                if (entityProps.itemId === 0) {
                    cesiumMissionManager.updateHomeAndLocationForZero()
                }
            }
            dragging_point = undefined
            viewer.scene.screenSpaceCameraController.enableRotate = true;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // Drag move
    handler.setInputAction(function (movement) {
        if (dragging_point) {
            const entityProps = dragging_point.id.properties.getValue()

            switch(dragging_point.id.name) {
                case 'groundPoint':
                    const cartesian = getCartesianFromMovement(movement.endPosition)
                    const cartographicPosition = Cesium.Cartographic.fromCartesian(cartesian)
                    cesiumMissionManager.updateGroundPosition(entityProps.itemId, cartographicPosition)
                    break
                case 'altPoint':
                    const offsetY = movement.startPosition.y - movement.endPosition.y
                    let [offset, _] = cesiumMissionManager.getAltPosition(entityProps.itemId)

                    offset += offset < 100
                        ? offset < 50
                            ? offsetY / 3
                            : offsetY / 2
                        : offsetY

                    cesiumMissionManager.updateAltPosition(entityProps.itemId, offset)
                    break
                case 'loiterCyl':
                    const {lat, lon} = cesiumMissionManager.getGroundPosition(entityProps.itemId)
                    const [terrainAlt, offsetAlt] = cesiumMissionManager.getAltPosition(entityProps.itemId)
                    const pointPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                        viewer.scene,
                        Cesium.Cartesian3.fromDegrees(lon, lat, terrainAlt + offsetAlt)
                    )

                    const r1 = Math.sqrt(
                        Math.pow(pointPosition.x - movement.startPosition.x, 2) +
                        Math.pow(pointPosition.y - movement.startPosition.y, 2)
                    )
                    const r2 = Math.sqrt(
                        Math.pow(pointPosition.x - movement.endPosition.x, 2) +
                        Math.pow(pointPosition.y - movement.endPosition.y, 2)
                    )
                    const angles = {
                        sin: (pointPosition.y - movement.endPosition.y) / r2,
                        cos: (pointPosition.x - movement.endPosition.x) / r2,
                    }

                    var radiusDelta = Math.sqrt(
                        Math.pow((angles.cos * r1) - (pointPosition.x - movement.endPosition.x), 2) +
                        Math.pow((angles.sin * r1) - (pointPosition.y - movement.endPosition.y), 2)
                    )

                    cesiumMissionManager.updateLoiterRadiusDelta(entityProps.itemId, r1 > r2 ? -radiusDelta : radiusDelta)
                    break
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    $('#is_neuron').change(function(e) {
        if ($(this).prop('checked')) {
            isNeuronFeature = true
            if (cesiumMissionManager.hasLaunchPoint) {
                const homeCords = cesiumMissionManager.getGroundPosition(0)
                cesium_mod_neuron.startIntegration(homeCords.lat, homeCords.lon)
            } else {
                cesium_mod_neuron.startIntegration()
            }
            utilChangeDefaultFetureState({neuron_aircrafts: true})
        } else {
            isNeuronFeature = false
            cesium_mod_neuron.stopIntegration()
            utilChangeDefaultFetureState({neuron_aircrafts: false})
        }
    })

    $('.features-selector').on('hidden.bs.collapse', function (e) {
        $('.cesium-viewer .cesium-viewer-toolbar').css({'left': $(this).outerWidth() + 10})
    })

    $(document).on('click', '.features-selector button', function (e) {
        if ($(this).attr("aria-expanded")) {
            var width = $(this).closest('.features-selector').outerWidth()
            $('.cesium-viewer .cesium-viewer-toolbar').css({'left': width + 10})
        }
    })

    $(document).ready(function () {
        var missionJSON;
        // console.log("go to 003 " + missionId);
    
        async function fetchMissionData() {
            if (missionId != "") {
                // console.log("go fetch data");
                try {
                    const response = await fetch(`https://dronecloudbackend.adaptable.app/api/getonemissionforplanner?missionId=${missionId}`);
                    // const response = await fetch(`http://localhost:5001/api/getonemissionforplanner?missionId=${missionId}`);
                    const data = await response.json();
                    missionJSON = data;
                    if(data.message === "Mission not found")
                    {
                        missionJSON = "{}";
                    }
                    // console.log("fetched mission " + missionId + " content " + missionJSON);
                } catch (error) {
                    console.error("Error fetching mission data:", error);
                }
            } else {
                // console.log("mission id is empty");
            }
        }
    
        // Call the asynchronous function and process mission data afterwards
        fetchMissionData().then(() => {
            // console.log("get mission data " + missionJSON + " missionId " + missionId);
            if (missionJSON && missionJSON != "\"\"" && missionJSON != "{}") {
                // console.log("go to 005");
                cesiumMissionManager.loadJsonMission(missionJSON, missionJSON.mission_name);
            } else {
                // console.log("missionJSON: " + missionJSON);
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var lon = position.coords.longitude;
                        var lat = position.coords.latitude;
    
                        // console.log("go to 006");
                        setTimeout(function () {
                            viewer.camera.flyTo({
                                destination: Cesium.Cartesian3.fromDegrees(lon, lat, 15000),
                                duration: 5.0,
                            });
                        }, 1200);
                    });
                }
            }
    
            if (isNeuronFeature) {
                if (cesiumMissionManager.hasLaunchPoint) {
                    const homeCords = cesiumMissionManager.getGroundPosition(0);
                    cesium_mod_neuron.startIntegration(homeCords.lat, homeCords.lon);
                } else {
                    cesium_mod_neuron.startIntegration();
                }
            }
        });
    });    
})()

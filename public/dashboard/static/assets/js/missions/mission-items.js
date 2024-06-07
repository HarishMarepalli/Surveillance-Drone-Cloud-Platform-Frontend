
// Message Definitions


// MAV_FRAME
const MAV_FRAME_GLOBAL = 0
const MAV_FRAME_MISSION = 2
const MAV_FRAME_GLOBAL_RELATIVE_ALT = 3

// ROI modes
const MAV_ROI_NONE = 0
const MAV_ROI_LOCATION = 3

// VTOL conf
const MAV_VTOL_STATE_MC = 3
const MAV_VTOL_STATE_FW = 4
const VTOL_TRANSITION_HEADING_NEXT_WAYPOINT = 1
const VTOL_TRANSITION_HEADING_TAKEOFF = 2
const VTOL_TRANSITION_HEADING_SPECIFIED = 3
const VTOL_TRANSITION_HEADING_ANY = 4
const NAV_VTOL_LAND_OPTIONS_FW_DESCENT = 1
const NAV_VTOL_LAND_OPTIONS_HOVER_DESCENT = 2

// Mavink mission mommands
const MAV_CMD_NAV_WAYPOINT = 16
const MAV_CMD_NAV_LOITER_UNLIM = 17
const MAV_CMD_NAV_LOITER_TURNS = 18
const MAV_CMD_NAV_LOITER_TIME = 19
const MAV_CMD_NAV_RETURN_TO_LAUNCH = 20
const MAV_CMD_NAV_LAND = 21
const MAV_CMD_NAV_TAKEOFF = 22
const MAV_CMD_NAV_LOITER_TO_ALT = 31
const MAV_CMD_NAV_VTOL_TAKEOFF = 84
const MAV_CMD_NAV_VTOL_LAND = 85
const MAV_CMD_NAV_DELAY = 93
const MAV_CMD_DO_JUMP = 177
const MAV_CMD_DO_CHANGE_SPEED = 178
const MAV_CMD_DO_SET_ROI = 201
const MAV_CMD_DO_SET_ROI_LOCATION = 195
const MAV_CMD_DO_SET_ROI_NONE = 197
const MAV_CMD_IMAGE_START_CAPTURE = 2000
const MAV_CMD_IMAGE_STOP_CAPTURE = 2001
const MAV_CMD_VIDEO_START_CAPTURE = 2500
const MAV_CMD_VIDEO_STOP_CAPTURE = 2501
const MAV_CMD_DO_VTOL_TRANSITION = 3000


class MissionItem {
    // Default values
    static defaultCurrent = 0
    static defaultAutocontinue = 1

    static defaultFrame = 3
    static defaultTerrainAlt = 50.0
    static defaultHoldTime = 0
    static defaultWPRadius = 3

    // Navigate Items
    static defaultHoldTime = 0  // Waypoint
    static defaultHeading = NaN  // Waypoint
    static defaultAcceptRadius = 0  // Waypoint
    static defaultPassRadius = 0  // Waypoint
    static defaultAbortAlt = 0  // Land
    static defaultLandMode = 0  // Land
    static defaultLoiterType = MAV_CMD_NAV_LOITER_UNLIM  // Loiter
    static defaultLoiterExitMode = 1  // Loiter
    static defaultLoiterRadius = 80  // Loiter
    static defaultLoiterTurns = 1  // Loiter
    static defaultLoiterTime = 10  // Loiter

    // Command Items
    static defaultSpeedType = 1  // Change speed
    static defaultSpeed = 5  // Change speed
    static defaultThrottle = -1  // Change speed
    static defaultGimbalDevice = 0  // ROI
    static defaultDelay = 0  // Delay
    static defaultSeqNumber = 1  // Jump
    static defaultRepeat = 2  // Jump
    static defaultStreamID = 0  // Video capture
    static defaultStatusFreq = 0  // Video capture
    static defaultInterval = 5  // Image capture
    static defaultTotalImages = 2  // Image capture
    static defaultTransitionMode = MAV_VTOL_STATE_MC  // VTOL transition
    static defaultTransitionHeading = VTOL_TRANSITION_HEADING_NEXT_WAYPOINT  // VTOL takeoff
    static defaultVtolLandBehaviour = NAV_VTOL_LAND_OPTIONS_FW_DESCENT  // VTOL land

    constructor({seq, frame, autocontinue, current, manager}) {
        this.manager = manager
        this.seq = seq
        this.frame = frame ?? MissionItem.defaultFrame
        this.current = current ?? MissionItem.defaultCurrent
        this.autocontinue = autocontinue ?? MissionItem.defaultAutocontinue

        this.menuLock = false
        this.unhealthyFields = []
        this.itemHealthy = true

        this.menuItemContent = undefined
    }

    getMissionCommand(launchHeight, autopilotType) {
        let missionItem = this.getCommandParams(launchHeight, autopilotType)
        return {
            pointName: this.pointName,
            frame: this.frame,
            current: this.current,
            autocontinue: this.autocontinue,
            ...missionItem
        }
    }

    getDjangoJsonItem() {
        return {
            pointName: this.pointName,
            frame: this.frame,
        }
    }

    fieldsHealthHandler(validated, targetClass) {
        if (validated) {
            if (this.unhealthyFields.includes(targetClass)) {
                this.unhealthyFields.splice(this.unhealthyFields.indexOf(targetClass), 1)
                this.menuLock = false
                this.manager.missionItemsHealthyCheck()

                if (this.itemIsHealthy()) {
                    this.manager.domManager.errorTitleColor(false, this.seq)
                }
            }
            return true
        } else {
            if (!this.unhealthyFields.includes(targetClass)) {
                this.unhealthyFields.push(targetClass)
                this.menuLock = true
                this.manager.missionItemsHealthyCheck()

                if (!this.itemIsHealthy()) {
                    this.manager.domManager.errorTitleColor(true, this.seq)
                }
            }
            return false
        }
    }

    itemIsHealthy() {
        if (this.unhealthyFields.length === 0) {
            this.itemHealthy = true
            return true
        }
        this.itemHealthy = false
        return false
    }

    getNavDomFields() {
        const inst = this
        const navDomTemplate = $($('template#nav-items').html())

        const altitudeInput = navDomTemplate.find(".altitude")
        const altitudeInputPlus = navDomTemplate.find('.altitude-plus')
        const altitudeInputMinus = navDomTemplate.find('.altitude-minus')
        const latInput = navDomTemplate.find('.lat')
        const lonInput = navDomTemplate.find('.lon')

        if (altitudeInput.length != 0) {
            altitudeInput.val(inst.terrainAltOffset)
            altitudeInput.on('input', function(event) {
                const target = $(event.target)
                const value = Number(target.val()) // TODO catch wrong value error

                const validated = validateBetweenNumber(target, value, 0, 1500)
                if (validated)
                    inst.terrainAltOffset = Number(value)
            })
        }
        if (altitudeInputPlus.length != 0 )
            altitudeInputPlus.on('click', function() {
                inst.terrainAltOffset += 1
                const pointCartographic = Cesium.Cartographic.fromDegrees(inst.lon, inst.lat)
                const pointHeight = inst.manager.viewer.scene.globe.getHeight(pointCartographic)
                if ((inst.terrainAlt + inst.terrainAltOffset) - pointHeight > inst.altLimit || pointHeight === undefined) {
                    inst.terrainAltOffset = inst.altLimit
                    altitudeInput.val(inst.altLimit)
                    return
                }
                altitudeInput.val(inst.terrainAltOffset)
            })
        if (altitudeInputMinus.length != 0 )
        altitudeInputMinus.on('click', function() {
            inst.terrainAltOffset -= 1
            const pointCartographic = Cesium.Cartographic.fromDegrees(inst.lon, inst.lat)
            const pointHeight = inst.manager.viewer.scene.globe.getHeight(pointCartographic)
            if ((inst.terrainAlt + inst.terrainAltOffset) - pointHeight < 0 || pointHeight === undefined) {
                inst.terrainAltOffset = 0
                altitudeInput.val(0)
                return
            }
            altitudeInput.val(inst.terrainAltOffset)
        })

        latInput.val(inst.lat.toFixed(8))
        latInput.on("input", function (event) {
            const target = $(event.target)
            var value = target.val()

            const validated = validateBetweenNumber(target, value, -90, 90)
            if (validated) {
                inst.lat = value
                inst.updateDistances()
                inst.manager.updateDistanceAndDuration()
            }
        })

        lonInput.val(inst.lon.toFixed(8))
        lonInput.on("input", function (event) {
            const target = $(event.target)
            var value = target.val()

            const validated = validateBetweenNumber(target, value, -180, 180)
            if (validated) {
                inst.lon = value
                inst.updateDistances()
                inst.manager.updateDistanceAndDuration()
            }
        })

        return navDomTemplate
    }

    updateItemSeq(seq) {
        this.seq = seq
    }

    getItemSeq() {
        return this.seq
    }
}

class CesiumMissionItem extends MissionItem {
    constructor(options) {
        super(options)
        this.cesiumEntities = []
        this.itemColorScheme = this.manager.colorScheme.main
    }

    initCesiumItem() {
        this.name = this.pointName
        this.createCesiumEntity()
    }

    createCesiumEntity() {}

    removeCesiumEntity() {
        this.cesiumEntities.forEach(entity => this.manager.dataSource.entities.remove(entity))
    }

    static lineFraction(cart1, cart2, fraction) { // TODO mb change output
        const difference = Cesium.Cartesian3.subtract(cart2, cart1, new Cesium.Cartesian3())
        const distance = Cesium.Cartesian3.magnitude(difference)
        const direction = Cesium.Cartesian3.normalize(difference, new Cesium.Cartesian3())
        return {
            point: Cesium.Cartesian3.add(cart1, Cesium.Cartesian3.multiplyByScalar(direction, distance * fraction, new Cesium.Cartesian3()), new Cesium.Cartesian3()),
            direction: direction
        }
    }
}

class CesiumMissionControlItem extends CesiumMissionItem {
    constructor(options) {
        super(options)
        this.frame = MAV_FRAME_MISSION
        this.prevPoint = undefined
        this.prevCommandsCount = 0
        this.pixelOffsetRadius = 30
        this.angleStep = Cesium.Math.toRadians(60)
    }

    createCesiumEntity() {
        this.createBillboardEntity(this)
    }

    createBillboardEntity(inst) {
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            name: this.name,
            position: undefined,
            label: {
                text: new Cesium.CallbackProperty(function () {
                    return inst.seq + ""
                }),
                font: "14px arial",
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: new Cesium.CallbackProperty(function () {
                    return new Cesium.Cartesian2(
                        0.5 + inst.pixelOffsetRadius * Math.cos(inst.angleStep * (inst.prevCommandsCount + 1) - Cesium.Math.toRadians(120)),
                        inst.pixelOffsetRadius * Math.sin(inst.angleStep * (inst.prevCommandsCount + 1) - Cesium.Math.toRadians(120))
                    )
                }),
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 10000, 0.0),
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 10000, 0.0),
                fillColor: this.manager.defaultCallbacks.text.fill(this),
                showBackground: true,
                backgroundColor: this.manager.defaultCallbacks.point.nav.main(this),
                backgroundPadding: new Cesium.Cartesian2(2, 2),
            },
            billboard: {
                image: MISSION_POINTS_UTLS.circle,
                width: 28,
                height: 28,
                pixelOffset: new Cesium.CallbackProperty(function () {
                    return new Cesium.Cartesian2(
                        inst.pixelOffsetRadius * Math.cos(inst.angleStep * (inst.prevCommandsCount + 1) - Cesium.Math.toRadians(120)),
                        inst.pixelOffsetRadius * Math.sin(inst.angleStep * (inst.prevCommandsCount + 1) - Cesium.Math.toRadians(120))
                    )
                }),
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 10000, 0),
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 10000, 0),
                color: this.manager.defaultCallbacks.point.nav.outline(this),
            },
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
        }))
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            name: this.name,
            position: undefined,
            billboard: {
                image: MISSION_POINTS_UTLS.circleBg,
                width: 28,
                height: 28,
                pixelOffset: new Cesium.CallbackProperty(function () {
                    return new Cesium.Cartesian2(
                        inst.pixelOffsetRadius * Math.cos(inst.angleStep * (inst.prevCommandsCount + 1) - Cesium.Math.toRadians(120)),
                        inst.pixelOffsetRadius * Math.sin(inst.angleStep * (inst.prevCommandsCount + 1) - Cesium.Math.toRadians(120))
                    )
                }),
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 10000, 0),
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 10000, 0),
                color: this.manager.defaultCallbacks.point.nav.main(this),
            },
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
        }))
    }

    updateConnectedPoints() {
        const prevNavPointId = this.manager.getPreviousCesiumNavPointIndex(this.seq - 1)
        if (prevNavPointId === undefined) {
            this.prevPoint = undefined
            this.prevCommandsCount = 0
            this.updateEntitiesPositions(undefined)
        } else {
            this.prevPoint = this.manager.missionItems[prevNavPointId]
            this.prevCommandsCount = this.manager.getPreviousCommandsCount(this.seq - 1, prevNavPointId)
            this.updateEntitiesPositions(this.prevPoint.pointEntity.position)
        }
    }

    updateEntitiesPositions(position) {
        this.cesiumEntities.map((entity) => {
            entity.position = position
        })
    }
}

class CesiumMissionNavItem extends CesiumMissionItem {
    constructor(options) {
        super(options)
        this.lat = options.coordinates[0]
        this.lon = options.coordinates[1]
        this.terrainAltOffset = options.coordinates[2]
        this.terrainAlt = utils_correctAlt(this.lon, this.lat, 0)  // TODO move to class
        this.updateTerrainHeight(this)


        this.nextPoint = undefined
        this.prevPoint = undefined
        this.roiPoint = undefined
        this.distance = undefined
        this.pointEntity = undefined
    }

    createCesiumEntity() {
        if (this.lat && this.lon) {
            this.createGroundPointEntity(this)
            this.createPointEntity(this)
            this.createHeightPolylineEntity(this)
            this.createHeightLabelEntity(this)
            this.createNextPointPolylineEntity(this)
            this.createNextPointLabelEntity(this)
            this.createNextPointCylEntity(this)
            //this.createNextPointDirectionEntity(this)
        }
    }

    createGroundPointEntity(inst) {
        // Ground point
        this.cesiumEntities.push(
            this.manager.dataSource.entities.add({
                name: 'groundPoint',
                position: new Cesium.CallbackProperty(function () {
                    return Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt);
                }),
                
                point: {
                    pixelSize: 30,
                    color: this.manager.defaultCallbacks.point.ground.main(this),
                    outlineColor: this.manager.defaultCallbacks.point.ground.outline(this),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    outlineWidth: 1
                },              
                properties: new Cesium.PropertyBag({
                    itemId: new Cesium.CallbackProperty(() => {return inst.seq})
                }),
            })
        )
    }

    createPointEntity(inst) {
        // Point
        this.pointEntity = this.manager.dataSource.entities.add({
            name: 'altPoint',
            position: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset);
            }),
            point: {
                pixelSize: 26,
                color: this.manager.defaultCallbacks.point.nav.main(this),
                outlineColor: this.manager.defaultCallbacks.point.nav.outline(this),
                outlineWidth: 1,
            },
            label: {
                show: true,
                font: "14px arial",
                text: new Cesium.CallbackProperty(function () {
                    return inst.seq + ""
                }),
                showBackground: true,
                backgroundColor: this.manager.defaultCallbacks.text.background(this),
                backgroundPadding: new Cesium.Cartesian2(2, 2),
                pixelOffset: new Cesium.Cartesian2(1, 0),
                fillColor: this.manager.defaultCallbacks.text.fill(this),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
            },
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
        })
        this.cesiumEntities.push(this.pointEntity)
    }

    createHeightPolylineEntity(inst) {
        // Line between point and point_ground
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            polyline: {
                width: 1,
                positions: new Cesium.CallbackProperty(function () {
                    return Cesium.Cartesian3.fromDegreesArrayHeights(
                        [inst.lon, inst.lat, inst.terrainAlt, inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset],
                    );
                }),
                material: this.manager.defaultCallbacks.polylineMaterialColor(this),
            },
        }))
    }

    createHeightLabelEntity(inst) {
        // Line label with height from ground to point.
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            name: 'heightLabel',
            position: new Cesium.CallbackProperty(function () {
                const cartGround = Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt)
                const cartPoint = Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset)
                const fractionResult = CesiumMissionItem.lineFraction(cartGround, cartPoint, 0.5)
                return fractionResult.point
            }),
            label: {
                // This callback updates the length to print each frame.
                show: true,
                font: "14px arial",
                text: new Cesium.CallbackProperty(function () {
                    let labelText = ''
                    labelText += inst.terrainAltOffset.toFixed(0) + " m\n"
                    labelText += inst.terrainAlt.toFixed(0) + " MSL"
                    return labelText
                }),
                fillColor: Cesium.Color.WHITE,
                showBackground: true,
                backgroundColor: Cesium.Color.fromBytes(90, 90, 90, 120),
                pixelOffset: new Cesium.Cartesian2(50, 0),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                translucencyByDistance: new Cesium.NearFarScalar(3000, 1.0, 3000, 0.0),
                outlineWidth: 3,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            },
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
        }))
    }

    createNextPointPolylineEntity(inst) {
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            polyline: {
                width: 3,
                positions: new Cesium.CallbackProperty(function () {
                    if (!inst.nextPoint)
                        return
                    return Cesium.Cartesian3.fromDegreesArrayHeights(
                        [inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset,
                         inst.nextPoint.lon, inst.nextPoint.lat, inst.nextPoint.terrainAlt + inst.nextPoint.terrainAltOffset],
                    );
                }),
                material: this.manager.defaultCallbacks.polylineMaterialColor(this),
            },
        }))
    }

    createNextPointCylEntity(inst) {
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            position: new Cesium.CallbackProperty(function () {
                if (!inst.nextPoint)
                    return
                const res = inst.getFractionPositionToNextPoint(0.75)
                return res.point
            }),
            cylinder : {
                length: new Cesium.CallbackProperty(function () {
                    return Math.min(inst.distance / 3.5, 25)
                }),
                topRadius : 0,
                bottomRadius: new Cesium.CallbackProperty(function () {
                    return Math.min(inst.distance / 7, 3.5)
                }),
                material: this.manager.defaultCallbacks.mainMaterialColor(this),
                //numberOfVerticalLines: 2,
                //fill: false,
                slices: 64,
            },
            orientation: new Cesium.CallbackProperty(function () {
                if (!inst.nextPoint)
                    return
                const res = inst.getFractionPositionToNextPoint(0.75)
                var transform4 = Cesium.Transforms.eastNorthUpToFixedFrame(res.direction);
                var transform3 = Cesium.Matrix4.getRotation(transform4, new Cesium.Matrix3);
                return Cesium.Quaternion.fromRotationMatrix(transform3)
            })
        }))
    }

    createNextPointLabelEntity(inst) {
        // Line label with distance to the next point.
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            position: new Cesium.CallbackProperty(function () {
                if (!inst.nextPoint)
                    return
                const fractionResult = inst.getFractionPositionToNextPoint()
                return fractionResult.point
            }),
            label: {
                // This callback updates the length to print each frame.
                show: true,
                font: "14px arial",
                text: new Cesium.CallbackProperty(function () {
                    if (inst.distance)
                        return inst.distance.toFixed(0) + "m"
                    }),
                fillColor: Cesium.Color.WHITE,
                showBackground: true,
                backgroundColor: Cesium.Color.fromBytes(90, 90, 90, 120),
                pixelOffset: new Cesium.Cartesian2(0, -10),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                translucencyByDistance: new Cesium.NearFarScalar(3000, 1.0, 3000, 0.0),
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 3,
            },
        }))
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            name: 'betweenPoint',
            position: new Cesium.CallbackProperty(function () {
                if (!inst.nextPoint)
                    return
                const fractionResult = inst.getFractionPositionToNextPoint()
                return fractionResult.point
            }),
            point: {
                pixelSize: 20,
                color: Cesium.Color.fromBytes(90, 90, 90, 30),
                outlineColor: this.manager.defaultCallbacks.mainColor(this),
                outlineWidth: 1,
            },
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
        }))
    }

    getFractionPositionToNextPoint(fraction=0.5) {
        const currentItemPose = Cesium.Cartesian3.fromDegrees(this.lon, this.lat, this.terrainAlt + this.terrainAltOffset)
        const nextItemPose = Cesium.Cartesian3.fromDegrees(this.nextPoint.lon, this.nextPoint.lat, this.nextPoint.terrainAlt + this.nextPoint.terrainAltOffset)
        return CesiumMissionItem.lineFraction(currentItemPose, nextItemPose, fraction)
    }

    updateGroundPosition(cartographicPosition) {
        this.lat = Cesium.Math.toDegrees(cartographicPosition.latitude)
        this.lon = Cesium.Math.toDegrees(cartographicPosition.longitude)
        if (this.menuItemContent) {
            // Will be beter to use menu item class with binded fiellds
            this.menuItemContent.find('.lat').val(this.lat.toFixed(8))
            this.menuItemContent.find('.lon').val(this.lon.toFixed(8))
        }
        this.terrainAlt = this.manager.viewer.scene.globe.getHeight(cartographicPosition)

        this.updateDistances()
    }

    updateAltPosition(alt) {
        const pointCartographic = Cesium.Cartographic.fromDegrees(this.lon, this.lat)
        const pointHeight = this.manager.viewer.scene.globe.getHeight(pointCartographic)
        if ((this.terrainAlt + alt) - pointHeight < 0 || pointHeight === undefined) {
            this.terrainAltOffset = 0
            return
        }
        this.terrainAltOffset = alt

        if (this.menuItemContent) {
            // Will be beter to use menu item class with binded fiellds
            this.menuItemContent.find('.altitude').val(this.terrainAltOffset.toFixed(0))
        }
        this.updateDistances()
    }

    updateSpeed(speed) {
        this.speed = speed
        if (this.menuItemContent) {
            // Will be beter to use menu item class with binded fiellds
            this.menuItemContent.find('.speed').val(this.speed.toFixed(0))
        }
    }

    async updateTerrainHeight() {
        const terrainProvider = this.manager.viewer.terrainProvider
        const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, [Cesium.Cartographic.fromDegrees(this.lon, this.lat)])
        this.terrainAlt = updatedPositions[0].height ?? this.terrainAlt
        this.manager.updateLandAlt()
        this.updateDistances()
    }

    updateDistances() {
        this.updateDistance()
        if (this.prevPoint) {
            this.prevPoint.updateDistance()
        }
    }

    updateDistance() {
        if (!this.nextPoint) {
            this.distance = undefined
            return
        }
        // It may be better to use an ellipsoid distance, but the error is small
        const startCartesian = Cesium.Cartesian3.fromDegrees(this.lon, this.lat, this.terrainAlt + this.terrainAltOffset)
        const endCartesian = Cesium.Cartesian3.fromDegrees(this.nextPoint.lon, this.nextPoint.lat, this.nextPoint.terrainAlt + this.nextPoint.terrainAltOffset)
        this.distance = Cesium.Cartesian3.distance(startCartesian, endCartesian)
    }

    updateConnectedPoints() {
        const nextPointId = this.manager.getNextCesiumNavPointIndex(this.seq + 1)
        const prevPointId = this.manager.getPreviousCesiumNavPointIndex(this.seq - 1)
        this.nextPoint = this.manager.missionItems[nextPointId]
        this.prevPoint = this.manager.missionItems[prevPointId]
        if (this.nextPoint)
            this.nextPoint.prevPoint = this
        if (this.prevPoint)
            this.prevPoint.nextPoint = this

        this.manager.updateLandAlt()
        this.updateDistances()
    }

    getDjangoJsonItem() {
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            coordinates: [this.lat, this.lon, this.terrainAltOffset],
            ...defaultJsonItem,
        }
    }

    static pointIsNav(item) {
        if (item instanceof CesiumMissionNavItem &&
            !(item instanceof ROILocationItem))
            return true
        return false
    }
}

class WaypointItem extends CesiumMissionNavItem {
    pointName = 'waypoint'
    domMenuTemlate = $('template#waypoint')

    constructor(options) {
        super(options)

        this.delay = options.delay ?? MissionItem.defaultDelay
        this.speed = options.speed ?? options.manager.defaultSpeed
        this.wpRadius = options.wpRadius ?? options.manager.defaultWPRadius
        this.heading = options.heading ?? MissionItem.defaultHeading
        this.holdTime = options.holdTime ?? MissionItem.defaultHoldTime
        this.acceptRadius = options.acceptRadius ?? MissionItem.defaultAcceptRadius
        this.passRadius = options.passRadius ?? MissionItem.defaultPassRadius
        this.initCesiumItem()
    }

    getDjangoJsonItem() {
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(!isNaN(this.heading) && {heading: this.heading}),
            ...(this.holdTime != MissionItem.defaultHoldTime && {holdTime: this.holdTime}),
            ...(this.acceptRadius != MissionItem.defaultAcceptRadius && {acceptRadius: this.acceptRadius}),
            ...(this.passRadius != MissionItem.defaultPassRadius && {passRadius: this.passRadius}),
            ...defaultJsonItem,
        }
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_NAV_WAYPOINT,
            param1: this.holdTime,
            param2: this.acceptRadius,
            param3: this.passRadius,
            param4: NaN,
            x: this.lat,
            y: this.lon,
            z: this.terrainAltOffset + (this.terrainAlt - launchHeight),
        }
    }

    setupDomItem(itemHTML) {
        const inst = this
        const domItemContent = itemHTML.find('.mission-item-content')
        const navItems = this.getNavDomFields()
        domItemContent.append(navItems)
        domItemContent.append($(this.domMenuTemlate.html()))
        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        const delayInput = domItemContent.find('.delay')
        const speedInput = domItemContent.find('.speed')
        const wpRadiusInput = domItemContent.find('.wp-radius')
        const delayInputPlus = domItemContent.find('.delay-plus')
        const delayInputMinus = domItemContent.find('.delay-minus')
        const speedInputPlus = domItemContent.find('.speed-plus')
        const speedInputMinus = domItemContent.find('.speed-minus')
        const wpRadiusInputPlus = domItemContent.find('.wp-radius-plus')
        const wpRadiusInputMinus = domItemContent.find('.wp-radius-minus')
        const holdTimeInput = domItemContent.find('.hold-time')
        const headingInput = domItemContent.find('.heading')
        const acceptRadiusInput = domItemContent.find('.accept-radius')
        const passRadiusInput = domItemContent.find('.pass-radius')

        delayInput.val(this.delay)
        delayInput.on('input', function(event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 300)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.delay = Number(value)
        })

        if (delayInputPlus.length != 0 )
            delayInputPlus.on('click', function() {
                inst.delay += 1
                
                if (inst.delay > inst.delayLimit) {
                    delayInput.val(inst.delayLimit)
                    return
                }
                delayInput.val(inst.delay)
            })

        if (delayInputMinus.length != 0 )
            delayInputMinus.on('click', function() {
                inst.delay -= 1
                
                if (inst.delay < 0 ) {
                    inst.delay = 0
                    delayInput.val(0)
                    return
                }
                delayInput.val(inst.delay)
            })

        speedInput.val(this.speed)
        speedInput.on('input', function(event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 30)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.speed = Number(value)
        })
    

        if (speedInputPlus.length != 0 )
            speedInputPlus.on('click', function() {
                inst.speed += 1
                
                if (inst.speed > inst.speedLimit) {
                    speedInput.val(inst.speedLimit)
                    return
                }
                speedInput.val(inst.speed)
            })

        if (speedInputMinus.length != 0 )
            speedInputMinus.on('click', function() {
                inst.speed -= 1
                
                if (inst.speed < 0 ) {
                    inst.speed = 0
                    speedInput.val(0)
                    return
                }
                speedInput.val(inst.speed)
            })

        wpRadiusInput.val(this.wpRadius)
        wpRadiusInput.on('input', function(event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 3)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.wpRadius = Number(value)
        })
    

        if (wpRadiusInputPlus.length != 0 )
            wpRadiusInputPlus.on('click', function() {
                inst.wpRadius += 1
                
                if (inst.wpRadius > inst.wpRadiusLimit) {
                    wpRadiusInput.val(inst.wpRadiusLimit)
                    return
                }
                wpRadiusInput.val(inst.wpRadius)
            })

        if (wpRadiusInputMinus.length != 0 )
            wpRadiusInputMinus.on('click', function() {
                inst.wpRadius -= 1
                
                if (inst.wpRadius < 0 ) {
                    inst.wpRadius = 0
                    wpRadiusInput.val(0)
                    return
                }
                wpRadiusInput.val(inst.wpRadius)
            })

        holdTimeInput.val(this.holdTime)
        holdTimeInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.holdTime = Number(value)

            // console.log('itemHealthy', inst.itemHealthy)
        })

        headingInput.val(isNaN(this.heading) ? '' : this.heading)
        headingInput.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateHeading(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass)) {
                inst.heading = value === ''
                    ? NaN
                    : Number(value)
            }
        })

        acceptRadiusInput.val(this.acceptRadius)
        acceptRadiusInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.acceptRadius = Number(value)
        })

        passRadiusInput.val(this.passRadius)
        passRadiusInput.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.passRadius = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class LoiterItem extends CesiumMissionNavItem {
    pointName = 'loiter'
    domMenuTemlate = $('template#loiter')

    constructor(options) {
        super(options)

        this.clockwise = options.radius
            ? options.radius > 0 ? true : false
            : true

        this.vtolEntities = []

        this.loiterType = options.loiterType ?? MissionItem.defaultLoiterType
        this.exitMode = options.exitMode ?? MissionItem.defaultLoiterExitMode
        this.radius = options.radius ?? MissionItem.defaultLoiterRadius
        this.turns = options.turns ?? MissionItem.defaultLoiterTurns
        this.time = options.time ?? MissionItem.defaultLoiterTime
        this.initCesiumItem()
    }

    createCesiumEntity() {
        super.createCesiumEntity()
        this.createRadiusEllipse(this)
        this.createDirectionCyll(this)
    }

    createRadiusEllipse(inst) {
        // Point
        const circleEntity = this.manager.dataSource.entities.add({
            position: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat);
            }),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(function() {
                    return Math.abs(inst.radius)
                }),
                semiMajorAxis: new Cesium.CallbackProperty(function() {
                    return Math.abs(inst.radius)
                }),
                height: new Cesium.CallbackProperty(function() {
                    return inst.terrainAlt + inst.terrainAltOffset
                }),
                fill: false,
                outline: true,
                outlineColor: this.manager.defaultCallbacks.point.nav.outline(this),
                outlineWidth: 5,
            },
            show: inst.manager.aircraftType === 'copter' ? false : true,
        })

        this.vtolEntities.push(circleEntity)
        this.cesiumEntities.push(circleEntity)
    }

    createDirectionCyll(inst) {
        const topCyl = this.manager.dataSource.entities.add({
            name: 'loiterCyl',
            position: new Cesium.CallbackProperty(function () {
                const center = Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset);
                const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
                const cylPosition = Cesium.Matrix4.multiplyByPoint(transform,
                    new Cesium.Cartesian3(0, inst.radius, 0), new Cesium.Cartesian3());
                return cylPosition
            }),
            cylinder : {
                length: 35,
                topRadius : 0,
                bottomRadius: 10,
                material: this.manager.defaultCallbacks.mainMaterialColor(this),
                slices: 64,
            },
            orientation: new Cesium.CallbackProperty(function () {
                return Cesium.Transforms.headingPitchRollQuaternion(
                    Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat),
                    new Cesium.HeadingPitchRoll(
                        0,
                        Cesium.Math.toRadians(-90),
                        0
                    )
                )
            }),
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
            show: inst.manager.aircraftType === 'copter' ? false : true,
        })
        const botCyl = this.manager.dataSource.entities.add({
            name: 'loiterCyl',
            position: new Cesium.CallbackProperty(function () {
                const center = Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset);
                const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
                const cylPosition = Cesium.Matrix4.multiplyByPoint(transform,
                    new Cesium.Cartesian3(0, -inst.radius, 0), new Cesium.Cartesian3());
                return cylPosition
            }),
            cylinder : {
                length: 35,
                topRadius : 0,
                bottomRadius: 10,
                material: this.manager.defaultCallbacks.mainMaterialColor(this),
                slices: 64,
            },
            orientation: new Cesium.CallbackProperty(function () {
                return Cesium.Transforms.headingPitchRollQuaternion(
                    Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat),
                    new Cesium.HeadingPitchRoll(
                        0,
                        Cesium.Math.toRadians(90),
                        0
                    )
                )
            }),
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
            show: inst.manager.aircraftType === 'copter' ? false : true,
        })

        this.vtolEntities.push(topCyl, botCyl)
        this.cesiumEntities.push(topCyl, botCyl)
    }

    updateRadiusDelta(radiusDelta) {
        if (!this.clockwise) {
            radiusDelta *= -1
        }
        if (this.clockwise && (this.radius + radiusDelta) < 0 ||
            !this.clockwise && (this.radius + radiusDelta) > 0)
            return

        this.radius += radiusDelta
        this.menuItemContent.find('.radius').val(this.radius.toFixed(0))
    }

    changeClockwise() {
        this.clockwise = !this.clockwise
        this.radius *= -1
        this.menuItemContent.find('.radius').val(this.radius.toFixed(0))
    }

    getDjangoJsonItem() {
        const defaultJsonItem = super.getDjangoJsonItem()

        const itemParams = {
            ...(this.loiterType != MissionItem.defaultLoiterType && {loiterType: this.loiterType}),
            ...(this.radius != MissionItem.defaultLoiterRadius && {radius: this.radius}),
            ...defaultJsonItem,
        }

        if (this.loiterType === MAV_CMD_NAV_LOITER_UNLIM) {
            return itemParams
        } else if (this.loiterType === MAV_CMD_NAV_LOITER_TURNS) {
            return {
                ...(this.turns != MissionItem.defaultLoiterTurns && {turns: this.turns}),
                ...(this.exitMode != MissionItem.defaultLoiterExitMode && {exitMode: this.exitMode}),
                ...itemParams,
            }
        } else if (this.loiterType === MAV_CMD_NAV_LOITER_TIME) {
            return {
                ...(this.time != MissionItem.defaultLoiterTime && {time: this.time}),
                ...(this.exitMode != MissionItem.defaultLoiterExitMode && {exitMode: this.exitMode}),
                ...itemParams,
            }
        } else if (this.loiterType === MAV_CMD_NAV_LOITER_TO_ALT) {
            return {
                ...(this.exitMode != MissionItem.defaultLoiterExitMode && {exitMode: this.exitMode}),
                ...itemParams,
            }
        }
    }

    getCommandParams(launchHeight, autopilotType) {
        const commandParams = {
            command: this.loiterType,
            x: this.lat,
            y: this.lon,
            z: this.terrainAltOffset + (this.terrainAlt - launchHeight),
        }
        if (this.loiterType === MAV_CMD_NAV_LOITER_UNLIM) {
            return {
                param1: 0,  // empty
                param2: 0,  // empty
                param3: this.radius,
                param4: NaN,
                ...commandParams
            }
        } else if (this.loiterType === MAV_CMD_NAV_LOITER_TURNS) {
            return {
                param1: this.turns,
                param2: this.exitMode,
                param3: this.radius,
                param4: 1,  // Xtrack location
                ...commandParams
            }
        } else if (this.loiterType === MAV_CMD_NAV_LOITER_TIME) {
            return {
                param1: this.time,
                param2: this.exitMode,
                param3: this.radius,
                param4: 1,  // Xtrack location
                ...commandParams
            }
        } else if (this.loiterType === MAV_CMD_NAV_LOITER_TO_ALT) {
            return {
                param1: this.exitMode,
                param2: this.radius,
                param3: 0,  // empty
                param4: 1,  // Xtrack location
                ...commandParams
            }
        }
    }

    setupDomItem(itemHTML) {
        function showLoiterFields(type) {
            if ([MAV_CMD_NAV_LOITER_TURNS, MAV_CMD_NAV_LOITER_TIME, MAV_CMD_NAV_LOITER_TO_ALT].includes(type))
                exitModeSelect.closest('.row').attr('hidden', false)
            else if (type === MAV_CMD_NAV_LOITER_UNLIM)
                exitModeSelect.closest('.row').attr('hidden', true)

            if (type === MAV_CMD_NAV_LOITER_TURNS)
                turnsInput.closest('.row').attr('hidden', false)
            else
                turnsInput.closest('.row').attr('hidden', true)

            if (type === MAV_CMD_NAV_LOITER_TIME)
                timeInput.closest('.row').attr('hidden', false)
            else
                timeInput.closest('.row').attr('hidden', true)
        }
        const inst = this

        const selectionItems = {
            'unlim': MAV_CMD_NAV_LOITER_UNLIM,
            'turns': MAV_CMD_NAV_LOITER_TURNS,
            'time': MAV_CMD_NAV_LOITER_TIME,
            'to_alt': MAV_CMD_NAV_LOITER_TO_ALT,
        }

        const domItemContent = itemHTML.find('.mission-item-content')
        const navItems = this.getNavDomFields()
        domItemContent.append(navItems)
        domItemContent.append($(this.domMenuTemlate.html()))

        const loiterTypeSelect = domItemContent.find('.loiter-type')
        const radiusInput = domItemContent.find('.radius')
        const exitModeSelect = domItemContent.find('.exit-mode')
        const turnsInput = domItemContent.find('.turns')
        const timeInput = domItemContent.find('.time')

        loiterTypeSelect.val(getByValue(selectionItems, this.loiterType))
        showLoiterFields(this.loiterType)
        loiterTypeSelect.on('change', function (event) {
            const target = $(event.target)
            const value = target.val()

            showLoiterFields(selectionItems[value])
            inst.loiterType = Number(selectionItems[value])
        })

        radiusInput.val(this.radius.toFixed(0))
        radiusInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateField([
                [isNumber],
                [isInteger]
            ], target, value)

            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.radius = Number(value)
        })

        exitModeSelect.val(this.exitMode)
        exitModeSelect.on('change', function (event) {
            const target = $(event.target)
            const value = target.val()
            inst.exitMode = Number(value)
        })

        turnsInput.val(this.turns)
        turnsInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value, true)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.turns = Number(value)
        })

        timeInput.val(this.time)
        timeInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value, true)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.time = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class LaunchItem extends CesiumMissionNavItem {
    pointName = 'takeoff'
    domMenuTemlate = $('template#takeoff')

    constructor(options) {
        super(options)

        this.delay = options.delay ?? MissionItem.defaultDelay
        this.speed = options.speed ?? MissionItem.defaultSpeed
        this.heading = options.heading ?? MissionItem.defaultHeading

        this.initCesiumItem()
    }

    createGroundPointEntity(inst) {
        // Ground point
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            name: 'groundPoint',
            position: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt);
            }),
            point: {
                pixelSize: 30,
                color: this.manager.defaultCallbacks.point.ground.main(this),
                outlineColor: this.manager.defaultCallbacks.point.ground.outline(this),
                disableDepthTestDistance: 100000,
                outlineWidth: 1
            },
            label: {
                show: true,
                font: "9px arial",
                text: "TKOFF",
                backgroundPadding: new Cesium.Cartesian2(2, 2),
                pixelOffset: new Cesium.Cartesian2(1, 0),
                fillColor: this.manager.defaultCallbacks.mainColor(this),
                disableDepthTestDistance: 100000,
            },
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
        }))
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(!isNaN(this.heading) && {heading: this.heading}),
            ...defaultJsonItem,
        }
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_NAV_TAKEOFF,
            param1: 0, // TODO minimal pitch?
            param2: 0,
            param3: 0,
            param4: this.heading,
            x: this.lat,
            y: this.lon,
            z: this.terrainAltOffset, // TODO frame checking!!!!
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        const navItems = this.getNavDomFields()
        domItemContent.append(navItems)
        domItemContent.append($(this.domMenuTemlate.html()))

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        const delayInput = domItemContent.find('.delay')
        const speedInput = domItemContent.find('.speed')
        const delayInputPlus = domItemContent.find('.delay-plus')
        const delayInputMinus = domItemContent.find('.delay-minus')
        const speedInputPlus = domItemContent.find('.speed-plus')
        const speedInputMinus = domItemContent.find('.speed-minus')

        delayInput.val(this.delay)
        delayInput.on('input', function(event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 300)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.delay = Number(value)
        })

        if (delayInputPlus.length != 0 )
            delayInputPlus.on('click', function() {
                inst.delay += 1
                
                if (inst.delay > inst.delayLimit) {
                    delayInput.val(inst.delayLimit)
                    return
                }
                delayInput.val(inst.delay)
            })

        if (delayInputMinus.length != 0 )
            delayInputMinus.on('click', function() {
                inst.delay -= 1
                
                if (inst.delay < 0 ) {
                    inst.delay = 0
                    delayInput.val(0)
                    return
                }
                delayInput.val(inst.delay)
            })

        speedInput.val(this.speed)
        speedInput.on('input', function(event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 30)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.speed = Number(value)
        })
    

        if (speedInputPlus.length != 0 )
            speedInputPlus.on('click', function() {
                inst.speed += 1
                
                if (inst.speed > inst.speedLimit) {
                    speedInput.val(inst.speedLimit)
                    return
                }
                speedInput.val(inst.speed)
            })

        if (speedInputMinus.length != 0 )
            speedInputMinus.on('click', function() {
                inst.speed -= 1
                
                if (inst.speed < 0 ) {
                    inst.speed = 0
                    speedInput.val(0)
                    return
                }
                speedInput.val(inst.speed)
            })

        const headingInput = domItemContent.find('.heading')

        headingInput.val(isNaN(this.heading) ? '' : this.heading)
        headingInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateHeading(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass)) {
                inst.heading = value === ''
                    ? NaN
                    : Number(value)
            }
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class LandItem extends CesiumMissionNavItem {
    pointName = 'land'
    domMenuTemlate = $('template#land')

    constructor(options) {
        super(options)
        this.heading = options.heading ?? MissionItem.defaultHeading
        this.abortAlt = options.abortAlt ?? MissionItem.defaultAbortAlt
        this.landMode = options.landMode ?? MissionItem.defaultLandMode
        this.initCesiumItem()
    }

    createCesiumEntity() {
        if (this.lat && this.lon) {
            this.createGroundPointEntity(this)
            this.createPointEntity(this)
            this.createHeightLabelEntity(this)
            this.createNextPointPolylineEntity(this)
            this.createNextPointCylEntity(this)
        }
    }

    createGroundPointEntity(inst) {
        // Ground point
        this.cesiumEntities.push(
        this.manager.dataSource.entities.add({
            name: 'groundPoint',
            position: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt);
            }),
            point: {
                pixelSize: 30,
                color: this.manager.defaultCallbacks.point.ground.main(this),
                outlineColor: this.manager.defaultCallbacks.point.ground.outline(this),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                outlineWidth: 1
            },
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
        })
        )
    }

    createNextPointCylEntity(inst) {
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            position: new Cesium.CallbackProperty(function () {
                const currentItemPose = Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset)
                const nextItemPose = Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt)
                return CesiumMissionItem.lineFraction(currentItemPose, nextItemPose, 0.75).point
            }),
            cylinder : {
                length: new Cesium.CallbackProperty(function () {
                    return Math.min(inst.terrainAltOffset / 3.5, 25)
                }),
                topRadius : 0,
                bottomRadius: new Cesium.CallbackProperty(function () {
                    return Math.min(inst.terrainAltOffset / 7, 3.5)
                }),
                material: this.manager.defaultCallbacks.mainMaterialColor(this),
                slices: 64,
            },
            orientation: new Cesium.CallbackProperty(function () {
                const currentItemPose = Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset)
                const nextItemPose = Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.terrainAlt)
                const direction = CesiumMissionItem.lineFraction(currentItemPose, nextItemPose, 0.75).direction
                const transform4 = Cesium.Transforms.eastNorthUpToFixedFrame(direction);
                const transform3 = Cesium.Matrix4.getRotation(transform4, new Cesium.Matrix3);
                return Cesium.Quaternion.fromRotationMatrix(transform3)
            })
        }))
    }

    createNextPointPolylineEntity(inst) {
        this.cesiumEntities.push(this.manager.dataSource.entities.add({
            polyline: {
                width: 3,
                positions: new Cesium.CallbackProperty(function () {
                    return Cesium.Cartesian3.fromDegreesArrayHeights(
                        [inst.lon, inst.lat, inst.terrainAlt + inst.terrainAltOffset,
                         inst.lon, inst.lat, inst.terrainAlt]
                        )
                }),
                material: this.manager.defaultCallbacks.polylineMaterialColor(this),
            },
        }))
    }

    createPointEntity(inst) {
        // Point
        this.pointEntity = this.manager.dataSource.entities.add({
            position: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromDegrees(inst.lon, inst.lat, inst.prevPoint.terrainAlt + inst.prevPoint.terrainAltOffset);
            }),
            point: {
                pixelSize: 26,
                color: this.manager.defaultCallbacks.point.nav.main(this),
                outlineColor: this.manager.defaultCallbacks.point.nav.outline(this),
                outlineWidth: 1,
            },
            label: {
                show: true,
                font: "14px arial",
                text: new Cesium.CallbackProperty(function () {
                    return inst.seq + ""
                }),
                showBackground: true,
                backgroundColor: this.manager.defaultCallbacks.text.background(this),
                backgroundPadding: new Cesium.Cartesian2(2, 2),
                pixelOffset: new Cesium.Cartesian2(1, 0),
                fillColor: this.manager.defaultCallbacks.text.fill(this),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            properties: new Cesium.PropertyBag({
                itemId: new Cesium.CallbackProperty(() => {return inst.seq})
            }),
        })
        this.cesiumEntities.push(this.pointEntity)
    }

    updateAltPosition() {
        const pointCartographic = Cesium.Cartographic.fromDegrees(this.lon, this.lat)
        const pointHeight = this.terrainAlt
            ? this.terrainAlt
            : this.manager.viewer.scene.globe.getHeight(pointCartographic)  // TODO check for artifacts
        if (pointHeight !== undefined) {
            this.terrainAltOffset = this.prevPoint.terrainAlt - pointHeight + this.prevPoint.terrainAltOffset
        }

        this.updateDistances()
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.abortAlt != MissionItem.defaultAbortAlt && {abortAlt: this.abortAlt}),
            ...(this.landMode != MissionItem.defaultLandMode && {landMode: this.landMode}),
            ...(!isNaN(this.heading) && {heading: this.heading}),
            ...defaultJsonItem,
        }
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_NAV_LAND,
            param1: this.abortAlt,
            param2: this.landMode,
            param3: 0,  // empty
            param4: this.heading,
            x: this.lat,
            y: this.lon,
            z: 0, // TODO check for landing
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        const navItems = this.getNavDomFields()
        domItemContent.append(navItems)
        domItemContent.append($(this.domMenuTemlate.html()))

        const headingInput = domItemContent.find('.heading')
        const adortAltInput = domItemContent.find('.abort-alt')
        const landMode = domItemContent.find('.land-mode')

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        headingInput.val(isNaN(this.heading) ? '' : this.heading)
        headingInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateHeading(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass)) {
                inst.heading = value === ''
                    ? NaN
                    : Number(value)
            }
        })

        adortAltInput.val(this.abortAlt)
        adortAltInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.abortAlt = Number(value)
        })

        landMode.val(this.landMode)
        landMode.on('change', function (event) {
            const target = $(event.target)
            const value = target.val()

            inst.landMode = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class ROILocationItem extends CesiumMissionNavItem {
    pointName = 'roiLocation'
    domMenuTemlate = $('template#roi-location')

    constructor(options) {
        super(options)

        this.gimbalDevice = options.gimbalDevice ?? MissionItem.defaultGimbalDevice

        this.itemColorScheme = this.manager.colorScheme.roi
        this.initCesiumItem()
    }

    createCesiumEntity() {
        if (this.lat && this.lon) {
            this.createGroundPointEntity(this)
            this.createPointEntity(this)
            this.createHeightPolylineEntity(this)
            this.createHeightLabelEntity(this)
        }
    }

    updateConnectedPoints() {
    }

    getCommandParams(launchHeight, autopilotType) {
        let roiParams = {}
        if (autopilotType === 'apm')
            roiParams = {
                command: MAV_CMD_DO_SET_ROI,
                param1: MAV_ROI_LOCATION
            }
        else if (autopilotType === 'px4')
            roiParams = {
                command: MAV_CMD_DO_SET_ROI_LOCATION,
                param1: this.gimbalDevice
            }

        return {
            ...roiParams,
            param2: 0,  // empty
            param3: 0,  // empty
            param4: 0,  // empty
            x: this.lat,
            y: this.lon,
            z: this.terrainAltOffset + (this.terrainAlt - launchHeight), // TODO frame checking!!!!
        }
    }

    getDjangoJsonItem() {
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.gimbalDevice != MissionItem.defaultGimbalDevice && {gimbalDevice: this.gimbalDevice}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        const gimbalDeviceInput = domItemContent.find('.gimbal-device')

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        gimbalDeviceInput.val(this.gimbalDevice)
        gimbalDeviceInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 10)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.gimbalDevice = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class ROIDisableItem extends CesiumMissionControlItem {
    pointName = 'roiDisable'
    domMenuTemlate = $('template#roi-disable')

    constructor(options) {
        super(options)

        this.gimbalDevice = options.gimbalDevice ?? MissionItem.defaultGimbalDevice

        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        let roiParams = {}
        if (autopilotType === 'apm')
            roiParams = {
                command: MAV_CMD_DO_SET_ROI,
                param1: MAV_ROI_NONE
            }
        else if (autopilotType === 'px4')
            roiParams = {
                command: MAV_CMD_DO_SET_ROI_NONE,
                param1: this.gimbalDevice
            }
        return {
            ...roiParams,
            param2: 0,
            param3: 0,
            param4: 0,
            x: 0,
            y: 0,
            z: 0,
        }
    }

    getDjangoJsonItem() {
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.gimbalDevice != MissionItem.defaultGimbalDevice && {gimbalDevice: this.gimbalDevice}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        const gimbalDeviceInput = domItemContent.find('.gimbal-device')

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        gimbalDeviceInput.val(this.gimbalDevice)
        gimbalDeviceInput.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 10, true)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.gimbalDevice = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class ChangeSpeedItem extends CesiumMissionControlItem {
    pointName = 'changeSpeed'
    domMenuTemlate = $('template#change-speed')

    constructor(options) {
        super(options)
        this.speedType = options.speedType ?? MissionItem.defaultSpeedType
        this.speed = options.speed ?? MissionItem.defaultSpeed
        this.throttle = options.throttle ?? MissionItem.defaultThrottle
        this.initCesiumItem()
    }

    getDjangoJsonItem() {
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.speed != MissionItem.defaultSpeed && {speed: this.speed}),
            ...(this.speedType != MissionItem.defaultSpeedType && {speedType: this.speedType}),
            ...(this.throttle != MissionItem.defaultThrottle && {throttle: this.throttle}),
            ...defaultJsonItem,
        }
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_DO_CHANGE_SPEED,
            param1: this.speedType,
            param2: this.speed,
            param3: this.throttle,
            param4: 0,
            x: 0,
            y: 0,
            z: 0,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        const speedInput = domItemContent.find('.speed')
        const speedTypeOption = domItemContent.find('.speed-type')

        speedInput.val(this.speed)
        speedInput.on('input', function(event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 30)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.speed = Number(value)
        })

        speedTypeOption.val(this.speedType)
        speedTypeOption.on('change', function (event) {
            const target = $(event.target)
            var value = target.val()

            inst.speedType = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class DelayItem extends CesiumMissionControlItem {
    pointName = 'delay'
    domMenuTemlate = $('template#delay')

    constructor(options) {
        super(options)
        this.delay = options.delay ?? MissionItem.defaultDelay
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_NAV_DELAY,
            param1: this.delay,
            param2: NaN,
            param3: NaN,
            param4: NaN,
            x: NaN,
            y: NaN,
            z: NaN,
        }
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.delay != MissionItem.defaultDelay && {delay: this.delay}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        const delayInput = domItemContent.find('.delay')

        delayInput.val(this.delay)
        delayInput.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.delay = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class JumpItem extends CesiumMissionControlItem {
    pointName = 'jump'
    domMenuTemlate = $('template#jump')

    constructor(options) {
        super(options)
        this.seqNumber = options.seqNumber ?? MissionItem.defaultSeqNumber
        this.repeat = options.repeat ?? MissionItem.defaultRepeat
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_DO_JUMP,
            param1: this.seqNumber,
            param2: this.repeat,
            param3: 0,  // empty
            param4: 0,  // empty
            x: 0,  // empty
            y: 0,  // empty
            z: 0,  // empty
        }
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.seqNumber != MissionItem.defaultSeqNumber && {seqNumber: this.seqNumber}),
            ...(this.repeat != MissionItem.defaultRepeat && {repeat: this.repeat}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        const toItemInput = itemHTML.find('.to-item')
        const repeatInput = itemHTML.find('.repeat')

        toItemInput.val(this.seqNumber)
        toItemInput.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.seqNumber = Number(value)
        })

        repeatInput.val(this.repeat)
        repeatInput.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validatePositiveNumber(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.repeat = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class StartVideoCaptureItem extends CesiumMissionControlItem {
    pointName = 'startVideoCapture'
    domMenuTemlate = $('template#start-video-capture')

    constructor(options) {
        super(options)
        this.streamID = options.streamID ?? MissionItem.defaultStreamID
        this.statusFreq = options.statusFreq ?? MissionItem.defaultStatusFreq
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_VIDEO_START_CAPTURE,
            param1: this.streamID,
            param2: this.statusFreq,
            param3: NaN,
            param4: NaN,
            x: 0,
            y: 0,
            z: NaN,
        }
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.streamID != MissionItem.defaultStreamID && {streamID: this.streamID}),
            ...(this.statusFreq != MissionItem.defaultStatusFreq && {statusFreq: this.statusFreq}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        const streamId = domItemContent.find('.stream-id')

        streamId.val(this.delay)
        streamId.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 10, true)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.streamID = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class StopVideoCaptureItem extends CesiumMissionControlItem {
    pointName = 'stopVideoCapture'
    domMenuTemlate = $('template#stop-video-capture')

    constructor(options) {
        super(options)
        this.streamID = options.streamID ?? MissionItem.defaultStreamID
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_VIDEO_STOP_CAPTURE,
            param1: this.streamID,
            param2: NaN,
            param3: NaN,
            param4: NaN,
            x: 0,
            y: 0,
            z: NaN,
        }
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.streamID != MissionItem.defaultStreamID && {streamID: this.streamID}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        const streamId = domItemContent.find('.stream-id')

        streamId.val(this.delay)
        streamId.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 10, true)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.streamID = Number(value)
        })


        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class StartImageCaptureItem extends CesiumMissionControlItem {
    pointName = 'startImageCapture'
    domMenuTemlate = $('template#start-image-capture')

    constructor(options) {
        super(options)
        this.interval = options.interval ?? MissionItem.defaultInterval
        this.totalImages = options.totalImages ?? MissionItem.defaultTotalImages
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_IMAGE_START_CAPTURE,
            param1: 0,
            param2: this.interval,
            param3: this.totalImages,
            param4: 1,
            x: 0,
            y: 0,
            z: NaN,
        }
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.interval != MissionItem.defaultInterval && {interval: this.interval}),
            ...(this.totalImages != MissionItem.defaultTotalImages && {totalImages: this.totalImages}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        const intervalInput = domItemContent.find('.stream-id')
        const totalImagesInput = domItemContent.find('.stream-id')

        intervalInput.val(this.delay)
        intervalInput.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateBetweenNumber(target, value, 0, 5)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.streamID = Number(value)
        })

        totalImagesInput.val(this.delay)
        totalImagesInput.on('input', function (event) {
            const target = $(event.target)
            let value = target.val()

            const validated = validatePositiveNumber(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass))
                inst.totalImages = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class StopImageCaptureItem extends CesiumMissionControlItem {
    pointName = 'stopImageCapture'
    domMenuTemlate = $('template#stop-image-capture')

    constructor(options) {
        super(options)
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_IMAGE_STOP_CAPTURE,
            param1: NaN,
            param2: NaN,
            param3: NaN,
            param4: NaN,
            x: NaN,
            y: NaN,
            z: NaN,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class CameraConfigItem extends CesiumMissionControlItem {
    pointName = 'cameraConfig'
    domMenuTemlate = $('template#camera-config')

    constructor(options) {
        super(options)
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) { // TODO
        return {
            command: undefined,
            param1: NaN,
            param2: NaN,
            param3: NaN,
            param4: NaN,
            x: NaN,
            y: NaN,
            z: NaN,
        }
    }

    getDjangoJsonItem() {
        const defaultJsonItem = super.getDjangoJsonItem()
        return defaultJsonItem
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class RTLItem extends CesiumMissionControlItem {
    pointName = 'rtl'
    domMenuTemlate = $('template#rtl')

    constructor(options) {
        super(options)
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) { // TODO
        return {
            command: MAV_CMD_NAV_RETURN_TO_LAUNCH,
            param1: NaN,
            param2: NaN,
            param3: NaN,
            param4: NaN,
            x: NaN,
            y: NaN,
            z: NaN,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class VtolTransition extends CesiumMissionControlItem {
    pointName = 'vtolTransition'
    domMenuTemlate = $('template#vtol-transition')

    constructor(options) {
        super(options)
        this.transitionMode = options.transitionMode ?? MissionItem.defaultTransitionMode
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_DO_VTOL_TRANSITION,
            param1: this.transitionMode,
            param2: 0,
            param3: 0,  // empty
            param4: 0,  // empty
            x: 0,  // empty
            y: 0,  // empty
            z: 0,  // empty
        }
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.transitionMode != MissionItem.defaultTransitionMode && {transitionMode: this.transitionMode}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        const transitionModeSelect = domItemContent.find('.transition-mode')

        transitionModeSelect.val(this.transitionMode)
        transitionModeSelect.on('change', function (event) {
            const target = $(event.target)
            const value = target.val()

            inst.transitionMode = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class VtolTakeoff extends CesiumMissionNavItem {
    pointName = 'vtolTakeoff'
    domMenuTemlate = $('template#vtol-takeoff')

    constructor(options) {
        super(options)
        this.transitionHeading = options.transitionHeading ?? MissionItem.defaultTransitionHeading
        this.heading = options.heading ?? MissionItem.defaultHeading
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_NAV_VTOL_TAKEOFF,
            param1: 0,  // empty
            param2: this.transitionHeading,
            param3: 0,  // empty
            param4: this.heading,
            x: this.lat,
            y: this.lon,
            z: this.terrainAltOffset,
        }
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.transitionHeading != MissionItem.defaultTransitionHeading && {transitionHeading: this.transitionHeading}),
            ...(!isNaN(this.heading) && {heading: this.heading}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        function showHeading(show) {
            // console.log('show heading', headingInput)
            if (show)
                headingInput.closest('.row').css('display', 'flex')
            else
                headingInput.closest('.row').css('display', 'none')
        }

        const inst = this
        const selectionItems = {
            nextWp: 1,
            takeoff: 2,
            parameter: 3,
            any: 4,
        }

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        const transitionHeadingSelect = domItemContent.find('.transition-heading')
        const headingInput = domItemContent.find('.heading')

        transitionHeadingSelect.val(getByValue(selectionItems, this.transitionHeading))
        if (this.transitionHeading === 3)
            showHeading(true)
        else
            showHeading(false)


        transitionHeadingSelect.on('change', function (event) {
            const target = $(event.target)
            const value = target.val()

            inst.transitionHeading = Number(selectionItems[value])
            if (inst.transitionHeading === 3)
                showHeading(true)
            else
                showHeading(false)
        })

        headingInput.val(isNaN(this.heading) ? '' : this.heading)
        headingInput.on('input', function (event) {
            const target = $(event.target)
            const value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateHeading(target, value)
            if (inst.fieldsHealthHandler(validated, targetClass)) {
                inst.heading = value === ''
                    ? NaN
                    : Number(value)
            }
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}

class VtolLand extends CesiumMissionNavItem {
    pointName = 'vtolLand'
    domMenuTemlate = $('template#vtol-land')

    constructor(options) {
        super(options)
        this.landBehaviour = options.landBehaviour ?? MissionItem.defaultVtolLandBehaviour
        this.approachAlt = options.approachAlt ?? 100 // TODO ????
        this.initCesiumItem()
    }

    getCommandParams(launchHeight, autopilotType) {
        return {
            command: MAV_CMD_NAV_VTOL_LAND,
            param1: this.landBehaviour,
            param2: 0,  // empty
            param3: NaN,  // Doesn't use in apm vtol
            param4: NaN,
            x: this.lat,
            y: this.lon,
            z: this.terrainAltOffset,
        }
    }

    getDjangoJsonItem() { // TODO move to defaults
        const defaultJsonItem = super.getDjangoJsonItem()

        return {
            ...(this.landBehaviour != MissionItem.defaultVtolLandBehaviour && {landBehaviour: this.landBehaviour}),
            ...(this.approachAlt != 100 && {approachAlt: this.approachAlt}),
            ...defaultJsonItem,
        }
    }

    setupDomItem(itemHTML) {
        const inst = this

        const selectionItems = {
            fwDescent: 1,
            copterDescent: 2,
        }

        const domItemContent = itemHTML.find('.mission-item-content')
        domItemContent.append($(this.domMenuTemlate.html()))

        domItemContent.find('.extra-title').on('click', function () {
            domItemContent.find('.collapse').collapse('toggle')
        })

        const landBehaviourSelect = domItemContent.find('.land-behaviour')
        const approachAltInput = domItemContent.find('.approach-alt')

        landBehaviourSelect.val(getByValue(selectionItems, this.landBehaviour))
        landBehaviourSelect.on('change', function (event) {
            const target = $(event.target)
            const value = target.val()

            inst.landBehaviour = Number(selectionItems[value])
        })

        approachAltInput.val(this.approachAlt)
        approachAltInput.on('input', function (event) {
            const target = $(event.target)
            var value = target.val()
            const targetClass = target.attr('class').split(' ')[0]

            const validated = validateField([
                [isEmpty],
                [isNumber],
            ], target, value)  // TODO

            if (validated)
                inst.approachAlt = Number(value)
        })

        this.menuItemContent = domItemContent
        return itemHTML
    }
}


// https://sandcastle.cesium.com/?src=Clamp%20to%20Terrain.html
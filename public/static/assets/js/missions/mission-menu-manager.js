class DomMissionManager {
    static defaultMissionName = 'New-Drone-Mission'

    constructor(missionManager, colorScheme) {
        this.missionManager = missionManager
        this.colorScheme = colorScheme ?? [0, 0, 0]
        this.name = undefined
        this.location = undefined
        this.missionsMenuItems = []
        this.itemTemplate = $('template#base-mission-item')
        this.menuTemplate = $('template#mission-menu')
        this.missionMenu = undefined
        this.missionTag = undefined

        this.itemsLocked = false
        this.hasHomeAddress = false

        this.speedLimit = 15
        this.altLimit = 10000
        this.delayLimit = 300
    }

    createMissionMenu() {
        const inst = this
        this.missionMenu = $(this.menuTemplate.html())
        this.missionMenu.addClass('closed')
        this.missionMenu.appendTo($('.map-container'))

        this.missionTag = this.missionMenu.find('.mission-tag')

        this.missionMenu.css({'background-color': this.colorScheme})
        this.missionTag.css({'background-color': this.colorScheme})

        this.name = this.missionManager.mission_name;

        const missionSettings = this.missionMenu.find('.mission-waypoints .mission-settings')
        const defaultAircraftType = missionSettings.find('.aircraft-type-select')
        const defaultSpeedInput = missionSettings.find('.default-speed')
        const defaultFrameOption = missionSettings.find('.frame-select')
        const defaultAltInput = missionSettings.find('.default-alt')
        const defaultWPRadiusInput = missionSettings.find('.default-wp-radius')
        const defaultMissionServiceType = this.missionMenu.find('.mission-service-type')
        const defaultMissionDroneId = this.missionMenu.find('.mission-drone-id')
        const defaultMissionTenantId = this.missionMenu.find('.mission-tenant-id')
        const defaultMissionMissionId = this.missionMenu.find('.mission-mission-id')
        const defaultMissionMissionName = this.missionMenu.find('.mission-mission-name')

        // Set default values
        defaultAircraftType.val(this.missionManager.aircraftType)
        defaultSpeedInput.val(this.missionManager.defaultSpeed)
        defaultFrameOption.val(this.missionManager.defaultFrame)
        defaultAltInput.val(this.missionManager.defaultTerrainAlt)
        defaultWPRadiusInput.val(this.missionManager.defaultWPRadius)

        // console.log("createMissionMenu:", this.missionManager.service_type, this.missionManager.drone_id)
        defaultMissionServiceType.val(this.missionManager.service_type)
        defaultMissionServiceType.text(this.missionManager.service_type)
        defaultMissionDroneId.val(this.missionManager.drone_id)
        defaultMissionDroneId.text(this.missionManager.drone_id)
        defaultMissionTenantId.val(this.missionManager.tenant_id)
        defaultMissionTenantId.text(this.missionManager.tenant_id)
        defaultMissionMissionId.val(this.missionManager.mission_id)
        defaultMissionMissionId.text(this.missionManager.mission_id)
        defaultMissionMissionName.val(this.missionManager.mission_name)
        defaultMissionMissionName.text(this.missionManager.mission_name)
        

        // Setup default values listeners
        missionSettings.find('> div:first-child').on('click', function () {
            missionSettings.find('> .collapse').collapse('toggle')
        })

        this.missionManager.changeAircraftType(this.missionManager.aircraftType)
        defaultAircraftType.on('change', function (event) {
            const target = $(event.target)
            let value = target.val()

            inst.missionManager.changeAircraftType(value)
            inst.missionManager.aircraftType = value
        })

        defaultSpeedInput.on('input', function (event) {
            const target = $(event.target)
            let stringValue = target.val()
            const speedValue = Number(stringValue)

            if (isNaN(speedValue))
                stringValue = MissionItem.defaultSpeed.toString()
            else if (speedValue > inst.missionManager.speedLimit)
                stringValue = inst.missionManager.speedLimit.toString()
            else if (speedValue.toFixed(2) != speedValue)
                stringValue = speedValue.toFixed(2)

            inst.missionManager.defaultSpeed = Number(stringValue)
            target.val(stringValue)
        })
        defaultFrameOption.on('change', function (event) {
            const target = $(event.target)
            inst.missionManager.defaultFrame = Number(target.val())
        })
        defaultAltInput.on('input', function (event) {
            const target = $(event.target)
            let stringValue = target.val()
            const speedValue = Number(stringValue)

            if (isNaN(speedValue))
                stringValue = MissionItem.defaultTerrainAlt.toString()
            else if (speedValue > inst.missionManager.altLimit)
                stringValue = inst.altLimit.toString()
            else if (speedValue.toFixed(2) != speedValue)
                stringValue = speedValue.toFixed(2)

            inst.missionManager.defaultTerrainAlt = Number(stringValue)
            target.val(stringValue)
        })
        missionSettings.find('.default-alt-minus').on('click', function () {
            let value = inst.missionManager.defaultTerrainAlt

            if (value - 1 <= 0)
                value = 0
            else
                value -= 1

            inst.missionManager.defaultTerrainAlt = value
            defaultAltInput.val(value)
        })
        missionSettings.find('.default-alt-plus').on('click', function () {
            let value = inst.missionManager.defaultTerrainAlt

            if (value + 1 >= inst.missionManager.altLimit)
                value = inst.missionManager.altLimit
            else
                value += 1

            inst.missionManager.defaultTerrainAlt = value
            defaultAltInput.val(value)
        })
        missionSettings.find('.apply-default-alt').on('click', function () {
            inst.missionManager.applyDefaultAlt()
        })

        missionSettings.find('.default-speed-minus').on('click', function () {
            let value = inst.missionManager.defaultSpeed

            if (value - 1 <= 0)
                value = 0
            else
                value -= 1

            inst.missionManager.defaultSpeed = value
            defaultSpeedInput.val(value)
        })
        missionSettings.find('.default-speed-plus').on('click', function () {
            let value = inst.missionManager.defaultSpeed

            if (value + 1 >= inst.missionManager.speedLimit)
                value = inst.missionManager.speedLimit
            else
                value += 1

            inst.missionManager.defaultSpeed = value
            defaultSpeedInput.val(value)
        })
        missionSettings.find('.apply-default-speed').on('click', function () {
            inst.missionManager.applyDefaultSpeed()
        })

        missionSettings.find('.default-wp-radius-minus').on('click', function () {
            let value = inst.missionManager.defaultWPRadius

            if (value - 1 <= 0)
                value = 0
            else
                value -= 1

            inst.missionManager.defaultWPRadius = value
            defaultWPRadiusInput.val(value)
        })
        missionSettings.find('.default-wp-radius-plus').on('click', function () {
            let value = inst.missionManager.defaultWPRadius

            if (value + 1 >= inst.missionManager.wpRadiusLimit)
                value = inst.missionManager.wpRadiusLimit
            else
                value += 1

            inst.missionManager.defaultWPRadius = value
            defaultWPRadiusInput.val(value)
        })
        missionSettings.find('.apply-default-wp-radius').on('click', function () {
            inst.missionManager.applyDefaultWPRadius()
        })

        this.formSubmit = this.missionMenu.find('.mission-form-submit')
        this.formSubmit.on('click', function (event) {
            if (!inst.missionManager.missionHealthy) {
                return  // TODO add error
            }
            // console.log("hello! i am going to send data to backend")
            
            var JSONmission = inst.missionManager.getJsonMission();
            // console.log(JSONmission);

            var formAction = inst.missionMenu.attr('action');
            var formData = new FormData(inst.missionMenu[0]);
            const thumbnailName = !inst.missionManager.thumbnailName
                ? "mission.png"
                : inst.missionManager.thumbnailName;
            // console.log("inst.missionMenu[0]", inst.missionMenu[0]);
            // console.log("formData", formData);
            // console.log("formAction", formAction);
            // console.log("thumbnailName", thumbnailName);

            fetch('https://dronecloudbackend.adaptable.app/api/createMissionPlanNew', {
            // fetch('http://localhost:5001/api/createMissionPlanNew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSONmission,
            })
            .then(response => {
                if (response.headers.get("content-type").includes("application/json")) {
                    return response.json();
                } else {
                    throw new Error('Received non-JSON response from server.');
                }
            })
            .then(data => {
                // console.log('Success:', data);
                showSnackbar("Mission Created/Updated Successfully");
                var jsonObj = JSON.parse(JSONmission)
                // console.log(jsonObj);
                // window.history.pushState({
                //     latitude: jsonObj.items[0].coordinates[0],
                //     longitude: jsonObj.items[0].coordinates[1],
                // }, "", "/viewMissions");
                // console.log("Hello");
                // window.location = "/viewMissions";
                
                // Dispatch a custom event
                // var event = new CustomEvent('plainJsButtonClick', { detail: { /* additional data if needed */ } });
                // window.dispatchEvent(event);

                // Set the click state to true in localStorage
                localStorage.setItem('clickState', 'true');
                //.setItem('clickResult', 'Mission Created/Updated Successfully');
            })
            .catch((error) => {
                // console.error('Error:', error);
                showSnackbar("Mission Creation/Updation Failed");

                // Set the click state to true in localStorage
                localStorage.setItem('clickState', 'true');
                //localStorage.setItem('clickResult', 'Mission Creation/Updation Failed');
            });
            
            /*const target = $(event.target)
            if (!inst.missionManager.missionHealthy) {
                return  // TODO add error
            }

            target.html('<div class="spinner-border text-white" />')
            var JSONmission = inst.missionManager.getJsonMission()
            inst.missionMenu.find('.mission-json').val(JSONmission)
            inst.missionManager.takeSnapshot().then(function (blob) {
                var formAction = inst.missionMenu.attr('action')
                var formData = new FormData(inst.missionMenu[0])

                const thumbnailName = !inst.missionManager.thumbnailName
                    ? "mission.png"
                    : inst.missionManager.thumbnailName

                var file = new File([blob], thumbnailName)
                formData.append('thumbnail', file);

                $.ajax({
                    url: formAction,
                    data: formData,
                    type: 'POST',
                    async: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        location.href = MISSIONS_URL
                    },
                    error: function (error) {
                        target.html('Retry')
                    }
                })
            })*/
        })

        this.missionMenu.find('.mission-form-upload').on('click', function() {
            var sysid = $(".drone-block.active").attr('data-id')
            var link_uuid = $(".drone-block.active").attr('link-uuid')
            const autopilotType = get_cesium_mod_drone().map_getDroneAutopilotType(link_uuid)
            const dronePosition = get_cesium_mod_drone().map_getDronePosition(link_uuid)
            var mavlinkMission = inst.missionManager.getMission(dronePosition, autopilotType)

            if (sysid && link_uuid) {
                get_mavlink_mod_missions(link_uuid).uploadMission(mavlinkMission, sysid, autopilotType)
                if (inst.missionManager.generalManager) {
                    inst.missionManager.generalManager.openMenuForm(false, inst.missionManager.id)
                } else {
                    inst.openForm(false)
                }
                //$alertAddPoint.hide() // TODO allert fixes
            }
        })
        this.missionMenu.find('.mission-form-edit').on('click', function() {
            inst.switchToEdit(true)
            inst.lockMenu(false)
            inst.missionManager.MModeController.set('edit')
            if (inst.missionManager.generalManager) {
                if (inst.missionManager.generalManager.editingMission) {
                    inst.missionManager.generalManager.getEditingManager().domManager.switchToEdit(false)
                }
                inst.missionManager.generalManager.editingMission = inst.missionManager.id
            }
        })

        this.missionMenu.find('.mission-form-simulate').on('click', function (event) {
            inst.missionManager.simulateMission()
        })

        this.missionMenu.find('.mission-form-pause').on('click', function (event) {
            inst.missionManager.pauseSimulation()
        })

        this.missionMenu.find('.mission-form-stop').on('click', function (event) {
            inst.missionManager.stopSimulation()
        })

        this.missionMenu.find('.mission-form-reset').on('click', function (event) {
            inst.missionManager.resetSimulation()
        })

        this.missionMenu.find('.mission-form-clean').on('click', function (event) {
            inst.missionManager.cleanMission()
        })

        this.missionMenu.on('submit', function (event) {
            event.preventDefault()
        })

        if (this.missionManager.number !== undefined)
            this.missionTag.css({top: 40 + 60 * (this.missionManager.number + 1) + 'px'})
        this.missionTag.find('.mission-collapse').on('click', function (event) {
            if (inst.missionManager.generalManager) {
                inst.missionManager.generalManager.openMenuForm(inst.missionMenu.hasClass('closed'), inst.missionManager.id)
            } else {
                inst.openForm(inst.missionMenu.hasClass('closed'))
            }
        })
        this.missionMenu.find('.hide-mission').on('click', (event) => {
            const element = $(event.target)
            const button = element.closest('div')

            inst.missionManager.showMission(false)
        })
        this.missionMenu.find('.show-mission').on('click', (event) => {
            const element = $(event.target)
            const button = element.closest('div')

            inst.missionManager.showMission(true)
        })
        this.missionMenu.find('.close-mission').on('click', (event) => {
            inst.missionManager.generalManager.deleteMission(inst.missionManager.id)
        })
        this.missionMenu.find('.collapse-all').on('click', (event) => {
            const element = $(event.target)
            const button = element.closest('div')

            this.collapseAllItems(-1)
        })
        this.missionMenu.find('.expand-all').on('click', (event) => {
            const element = $(event.target)
            const button = element.closest('div')

            this.expandAllItems(-1)
        })

        var nameEditThrottle = false
        this.missionMenu.find('.mission-name-edit').on('click', function (event) {
            if (nameEditThrottle) return
            const missionNameField = inst.missionMenu.find(".mission-name")
            const missionTextarea = missionNameField.find("textarea")
            const missionName = missionNameField.find("span")
            const nameIcon = missionNameField.find(".mission-name-edit")

            const editing = missionName.prop("contenteditable") == "true"

            if (editing) {
                stopNameEditing()
            } else {
                missionName.prop("contenteditable", true)
                nameIcon.removeClass("fas")
                nameIcon.addClass("far")

                setTimeout(function () {
                    var selectedText = window.getSelection();
                    var selectedRange = document.createRange();
                    selectedRange.setStart(missionName.get(0).childNodes[0], missionName.text().length);
                    selectedRange.collapse(true);
                    selectedText.removeAllRanges();
                    selectedText.addRange(selectedRange);
                    missionTextarea.focus()
                    nameEditThrottle = true
                }, 0)
            }
        })

        this.missionMenu.find('.mission-name').find('span').keydown(function(e){
            if (e.keyCode == 13 && !e.shiftKey) {
                e.preventDefault()
                stopNameEditing()
            }
        });

        this.missionMenu.find('.mission-name').find('span').bind('paste', function(e) {
            e.preventDefault()
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');
            $(e.target).text(text)
        })

        this.missionMenu.find('.mission-name').find('span').on('focusout', function() {
            stopNameEditing()
        })

        function stopNameEditing() {
            const missionNameField = inst.missionMenu.find(".mission-name")
            const missionTextarea = missionNameField.find("textarea")
            const missionName = missionNameField.find("span")
            const nameIcon = missionNameField.find(".mission-name-edit")

            missionName.prop("contenteditable", false)
            nameIcon.removeClass("far")
            nameIcon.addClass("fas")
            inst.name = missionName.text().trim()
            missionTextarea.text(inst.name)
            setTimeout(() => {
                nameEditThrottle = false
            }, 200)
        }

        // JavaScript
        function showSnackbar(message) {
            // Get the snackbar DIV
            var snackbar = document.getElementById("snackbar");
        
            // Update the snackbar content
            snackbar.textContent = message;
        
            // Add the "show" class to DIV
            snackbar.className = "show";
        
            // After 3 seconds, remove the "show" class from DIV
            setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", "");
            }, 3000);
        }
    }

    addPoint(itemName, itemId, missionManager) {
        let missionItem = $(this.itemTemplate.html())
        const itemTitle = missionItem.find('.title')
        itemTitle.find('.point-id').text(itemId)

        const formatedItemName = DomMissionManager.prepareItemName(itemName)
        itemTitle.find('.point-name').text(formatedItemName)
        missionItem.attr('itemId', itemId)

        const missionCommand = missionItem.find('.command')
        missionCommand.val(itemName)
        missionCommand.on('change', function(event) {
            const target = $(event.target)
            const currentId = Number(target.closest('.mission-item').attr('itemId'))
            const newItemType = target.val()
            missionManager.changeItemType(currentId, newItemType)
        })
        missionItem.find('.delete-icon').on('click', function(event) {
            const target = $(event.target)
            const menuMissionItem = target.closest('.mission-item')
            const currentId = Number(menuMissionItem.attr('itemId'))
            missionManager.removePoint(currentId)
            menuMissionItem.remove()
        })
        itemTitle.on('click', function(event) {
            const target = $(event.target)
            const menuMissionItem = target.closest('.mission-item')
            const currentId = Number(menuMissionItem.attr('itemId'))

            if (!this.missionManager.missionItems[currentId].menuLock) {
                const collapse = menuMissionItem.find("> .collapse")
                const wasOpened = collapse.hasClass("show")
                collapse.collapse("toggle")
                //this.collapseAllItems(currentId)
                this.selectItem(currentId)
                missionManager.selectedPointId = wasOpened ? -1 : currentId
            } else {
                missionManager.selectedPointId = currentId
            }
        }.bind(this))

        if (itemId === this.missionsMenuItems.length) {
            this.missionsMenuItems.push(missionItem)
            this.missionMenu.find('.mission-waypoints').append(missionItem)
        } else {
            this.missionsMenuItems.splice(itemId, 0, missionItem)
            itemId == 0
                ? this.missionMenu.find('.mission-waypoints .mission-settings').after(missionItem)
                : this.missionMenu.find(`.mission-waypoints .mission-item[itemId=${itemId - 1}]`).after(missionItem)
        }
        return missionItem
    }

    setDefaultValues(defaults) {
        const missionSettings = this.missionMenu.find('.mission-waypoints .mission-settings')
        const defaultAircraftType = missionSettings.find('.aircraft-type-select')
        const defaultSpeedInput = missionSettings.find('.default-speed')
        const defaultFrameOption = missionSettings.find('.frame-select')
        const defaultAltInput = missionSettings.find('.default-alt')
        const defaultServiceType = this.missionMenu.find(".mission-service-type")
        const defaultDroneId = this.missionMenu.find(".mission-drone-id")

        // Set default values
        defaultAircraftType.val(this.missionManager.aircraftType)
        defaultSpeedInput.val(defaults.defaultSpeed)
        defaultFrameOption.val(defaults.defaultFrame)
        defaultAltInput.val(defaults.defaultTerrainAlt)
        // console.log("setDefaultValues: ", this.missionManager.service_type, this.missionManager.drone_id)
        defaultServiceType.val(this.missionManager.service_type)
        defaultDroneId.val(this.missionManager.drone_id)
    }

    controlItemsOptions(commands, enable) {
        if (typeof commands === 'string')
            commands = [commands]

        for (const c of this.missionMenu.find('.command')) {
            for (const commandOption of $(c).children()) {
                if (commands.includes($(commandOption).val()))
                    $(commandOption).attr('hidden', !enable)
            }
        }
    }

    controlItemOptions(element, commands, enable) {
        if (typeof commands === 'string')
            commands = [commands]

        for (const c of element.find('.command')) {
            for (const commandOption of $(c).children()) {
                if (commands.includes($(commandOption).val()))
                    $(commandOption).attr('hidden', !enable)
            }
        }
    }

    setHomeAddress(newAddress) {
        let address = ''
        if (newAddress !== undefined) {
            address = newAddress
            this.hasHomeAddress = true
        } else {
            this.hasHomeAddress = false
        }

        const missionName = this.name === undefined
            ? this.hasHomeAddress === false
                ? DomMissionManager.defaultMissionName
                //: newAddress
                : DomMissionManager.defaultMissionName
            : this.name

        this.location = address
        const missionNameField = this.missionMenu.find(".mission-name")
        missionNameField.find("textarea").text(missionName)
        missionNameField.find("span").text(missionName)
        this.missionMenu.find(".mission-address").text(address)
    }

    setLaunchLatLon(lat, lon) { // TODO fix to normal way
        if (lat != undefined && lon != undefined) {
            this.missionMenu.find("input.mission-lat").val(Number(lat).toFixed(8))
            this.missionMenu.find("input.mission-lon").val(Number(lon).toFixed(8))
            this.missionMenu.find("span.mission-lat").text(Number(lat).toFixed(8) + ', ')
            this.missionMenu.find("span.mission-lon").text(Number(lon).toFixed(8))
        } else {
            this.missionMenu.find("input.mission-lat").val('')
            this.missionMenu.find("input.mission-lon").val('')
            this.missionMenu.find("span.mission-lat").text('')
            this.missionMenu.find("span.mission-lon").text('')
        }
    }

    setDistanceAndDuration(distance, duration) {
        let formatted
        formatted = DomMissionManager.formatSecondsToHms(duration)
        this.missionMenu.find("span.mission-duration").text(formatted)
        this.missionMenu.find("input.mission-duration").val(duration | 0)

        formatted = DomMissionManager.formatMetersToKM(distance)
        this.missionMenu.find("span.mission-distance").text(formatted)
        this.missionMenu.find("input.mission-distance").val(distance.toFixed(2))
    }

    setItemsCount(count) {
        this.missionMenu.find("span.mission-waypoints-count").text(count)
        this.missionMenu.find("input.mission-waypoints-count").val(count)
    }

    collapseAllItems(except) {
        except = except instanceof Array ? except : [except]
        for (let id = 0; id < this.missionsMenuItems.length; id++) {
            if (!except.includes(id) && !this.missionManager.missionItems[id].menuLock)
                this.missionsMenuItems[id].find("> .collapse").collapse("hide")
        }
    }

    expandAllItems(except) {
        except = except instanceof Array ? except : [except]
        for (let id = 0; id < this.missionsMenuItems.length; id++) {
            if (!except.includes(id) && !this.missionManager.missionItems[id].menuLock)
                this.missionsMenuItems[id].find("> .collapse").collapse("show")
        }
    }

    selectItem(itemId) {
        if (itemId !== undefined)
            this.missionsMenuItems[itemId].find("> .collapse").collapse("show")
        //this.collapseAllItems(itemId)
    }

    removeItem(itemId) {
        const missionItem = this.missionsMenuItems.splice(itemId, 1)[0]
        missionItem.first().remove()
    }

    updateItemId(itemId) {
        const missionItem = this.missionsMenuItems[itemId]
        missionItem.attr('itemId', itemId)
        const itemTitle = missionItem.find('.title')
        itemTitle.find('.point-id').text(itemId)
    }

    errorTitleColor(error, itemId) {
        const missionItem = this.missionsMenuItems[itemId]
        missionItem.find('.title').css(
            {'color': error ? '#d32f2f' : ''}
        )
    }

    validationError(validated, errorText) {
        // console.log('error', validated, errorText)
        if (validated) {
            this.formSubmit.removeClass('btn-primary')
            this.formSubmit.addClass('btn-danger')
            this.formSubmit.text(errorText)
        } else {
            this.formSubmit.removeClass('btn-danger')
            this.formSubmit.addClass('btn-primary')
            this.formSubmit.text('Save')
        }
    }

    openNotValidated() {

    }

    updateTagPosition() {
        this.missionMenu.find('.mission-tag').css({top: 40 + 60 * (this.missionManager.number + 1) + 'px'})
    }

    openForm(open, disableTranslate) {
        if (disableTranslate) {
            this.missionMenu.addClass('notransition')
            this.missionTag.addClass('notransition')
        }

        if (open) {
            this.missionMenu.removeClass('closed')
            this.missionTag.find('.mission-collapse').removeClass('closed')
        } else {
            this.missionMenu.addClass('closed')
            this.missionTag.find('.mission-collapse').addClass('closed')
        }

        if (disableTranslate) {
            setTimeout(function() {
                this.missionMenu.removeClass('notransition')
                this.missionTag.removeClass('notransition')
            }.bind(this), 5)
        }
    }

    deleteMenu() {
        this.missionMenu.remove()
    }

    switchToEdit(state) {
        this.missionMenu.find('.mission-actions').attr('hidden', state)
        this.missionMenu.find('.mission-edit').attr('hidden', !state)
    }

    lockMenu(lock) {
        this.missionMenu.find('.mission-name').find('i').css('display', lock ? 'none' : 'block')
        this.missionMenu.find('.mission-waypoints').find('input,select,button').attr('disabled', lock)
        this.missionManager.managerLocked = lock
    }

    lockItem(itemId, lock) {
        this.missionsMenuItems[itemId].find('input,select,button').attr('disabled', lock)
    }

    isOpened() {
        return this.missionMenu.hasClass('closed')
    }

    static prepareItemName(name) {
        let newName = name.charAt(0).toUpperCase()
        let char
        for (let charIndex = 1; charIndex < name.length; charIndex++) {
            char = name.charAt(charIndex)
            if (char === char.toUpperCase())
                newName += ' '
            newName += char
        }
        return newName
    }

    static formatMetersToKM(meters) {
        var k = meters / 1000 | 0;
        var m = (meters % 1000).toFixed(1);
        var result = ""

        result += k > 0 ? k + "km " : "";
        result += m > 0 ? m + "m " : "";
        return result ? result.trim() : '0'
    }

    static formatSecondsToHms(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = Math.floor(seconds % 3600 % 60);
        var result = ""

        result += h > 0 ? h + "h" : " ";
        result += m > 0 ? m + "m" : " ";
        result += s > 0 ? s + "s" : " ";
        result = result.trim()
        return result ? result : '0'
    }
}

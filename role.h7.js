var roleh7 = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // --- STATE MACHINE ---
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('📦 returning');
        }
        if (!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            creep.say('⛏️ mining');
        }

        // --- ACTION LOGIC ---
        if (creep.memory.harvesting) {
            // --- GO TO MINING ROOM ---
            const targetRoomName = 'W27S15'; // <-- SET THIS
            const targetPos = new RoomPosition(37, 42, targetRoomName);

            if (creep.room.name === targetRoomName) {
                const source = targetPos.lookFor(LOOK_SOURCES)[0];
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                creep.moveTo(targetPos, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else { // --- RETURN TO HOME ROOM TO DEPOSIT ---
            const homeRoomName = 'W29S14'; // <-- SET THIS

            if (creep.room.name === homeRoomName) {
                // --- Try containers in priority order ---
                const containers = [
                    Game.getObjectById('688a36c84ee3e64fb9f3cde8'),
                    Game.getObjectById('688a3a815d82914a6bac7f0b'),
                    Game.getObjectById('688a25d22211de0c59dce788')
                ];
                let deposited = false;
                for (const container of containers) {
                    if (container && container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container, { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                        deposited = true;
                        break;
                    }
                }
                // If all containers are full, just idle at (25,25)
                if (!deposited) {
                    creep.say('All full');
                    creep.moveTo(new RoomPosition(25, 25, homeRoomName), { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else {
                // If we are not home, move to a central point in our home room
                creep.moveTo(new RoomPosition(25, 25, homeRoomName), { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

module.exports = roleh7;
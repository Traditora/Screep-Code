/**
 * roleeff: Efficient hauler that collects from specific containers by priority
 * and deposits into specific containers by priority.
 */
var roleeff = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // --- STATE MACHINE ---
        if (creep.memory.hauling && creep.store.getUsedCapacity() == 0) {
            creep.memory.hauling = false;
            creep.say('🔄 withdraw');
        }
        if (!creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
            creep.memory.hauling = true;
            creep.say('🚚 haul');
        }

        // --- ACTION LOGIC ---
        if (creep.memory.hauling) {
            // Deposit in containers by priority
            const depositContainers = [
                Game.getObjectById('688a4f1d533a4abbdec23b97'),
                Game.getObjectById('688a53c490b4976fc919b719'),
                Game.getObjectById('688a25d22211de0c59dce788')
            ];
            let deposited = false;
            for (const container of depositContainers) {
                if (container && container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                    deposited = true;
                    break;
                }
            }
            if (!deposited) {
                creep.say('No deposit');
                // Idle at a fixed point if all are full
                const idlePoint = new RoomPosition(25, 25, creep.room.name);
                if (creep.pos.getRangeTo(idlePoint) > 0) {
                    creep.moveTo(idlePoint, { visualizePathStyle: { stroke: '#cc00cc' } });
                }
            }
        } else {
            // Withdraw from containers by priority
            const withdrawContainers = [
                Game.getObjectById('688a479d99c22d1607ccd0a0'),
                Game.getObjectById('688a36c84ee3e64fb9f3cde8'),
                Game.getObjectById('688a3a815d82914a6bac7f0b')
            ];
            let withdrawn = false;
            for (const container of withdrawContainers) {
                if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                    withdrawn = true;
                    break;
                }
            }
            if (!withdrawn) {
                creep.say('No energy');
                // Idle at a fixed point if nothing to withdraw
                const idlePoint = new RoomPosition(25, 25, creep.room.name);
                if (creep.pos.getRangeTo(idlePoint) > 0) {
                    creep.moveTo(idlePoint, { visualizePathStyle: { stroke: '#cc00cc' } });
                }
            }
        }
    }
};

module.exports = roleeff;
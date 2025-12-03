
export type Language = 'en' | 'vi';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // --- UI GENERAL ---
    'search_placeholder': 'Search experiments...',
    'system_active': 'System Active',
    'created_by': 'Created by',
    'author_name': 'PHUC DO',
    'theory_guide': 'Notebook',
    'theory': 'Theory',
    'guide': 'Guide',
    'physics_concepts': 'Physics Concepts',
    'theory_subtitle': 'Comprehensive textbook definitions & formulas',
    'interactive_guide': 'Lab Instructions',
    'guide_subtitle': 'Step-by-step simulation protocol',
    'pro_tip': 'Pro Tip',
    'pro_tip_content': 'To truly understand the relationship between variables, change ONLY ONE parameter at a time while keeping others constant (ceteris paribus).',
    
    // --- COMMON LABELS ---
    'control_center': 'Control Center',
    'measurements': 'Measurements',
    'remove_comp': 'Remove Component',
    'clear_all': 'Clear All',
    'reset': 'Reset',
    'velocity': 'Velocity', 'angle': 'Angle', 'height': 'Height', 'gravity': 'Gravity', 'drag': 'Drag',
    'mass': 'Mass', 'friction': 'Friction', 'thrust': 'Thrust', 'tension': 'Tension',
    'time': 'Time', 'range': 'Range', 'period': 'Period', 'frequency': 'Frequency',
    'length': 'Length', 'stiffness': 'Stiffness', 'damping': 'Damping', 'position': 'Position',
    'pressure': 'Pressure', 'temp': 'Temperature', 'volume': 'Volume', 'particles': 'Particles',
    'stop': 'Stop', 'fire': 'Fire', 'pause': 'Pause', 'simulate': 'Simulate', 'start': 'Start',
    'slow_motion': 'Slow Motion', 'real_time': 'Real Time',
    
    // --- SIMULATION SPECIFIC ---
    'flight_data': 'Flight Data', 'target_mode': 'Target Mode', 'target_hit': 'TARGET HIT', 'target_distance': 'Target Distance', 'drag_to_move': 'Drag to move',
    'oscillation_data': 'Oscillation Data', 'equilibrium_line': 'Equilibrium Line', 'graph_pos_time': 'Position vs Time', 'drag_to_start': 'Drag to start',
    'orbit_radius': 'Orbit Radius', 'angular_vel': 'Angular Velocity', 'vel_tangent': 'Tangent Velocity', 'centripetal_force': 'Centripetal Force',
    'acceleration': 'Acceleration', 'dynamics_controls': 'Dynamics Controls', 'locked_friction': 'LOCKED (Static Friction)', 'need_force': 'Need force >',
    'left_object': 'Left Object', 'right_object': 'Right Object', 'torque': 'Torque', 'equilibrium': 'Equilibrium', 'rotating_cw': 'Rotating CW', 'rotating_ccw': 'Rotating CCW', 'balanced': 'Balanced',
    'momentum': 'Momentum', 'kinetic': 'Kinetic Energy', 'object_1': 'Object 1', 'object_2': 'Object 2', 'obj_1_blue': 'Object 1 (Blue)', 'obj_2_red': 'Object 2 (Red)',
    'arch_physics_data': 'Physics Data', 'arch_weight': 'Weight (Air)', 'arch_obj_density': 'Object Density', 'arch_fluid_density': 'Fluid Density', 'arch_buoyancy': 'Buoyant Force', 'arch_scale': 'Scale Reading', 'arch_lower': 'Lower Object', 'arch_material': 'Material', 'arch_liquid': 'Liquid', 'arch_reset_pos': 'Reset Position', 'floating': 'FLOATING', 'displaced': 'Displaced',
    'brick': 'Brick', 'gold': 'Gold', 'wood': 'Wood', 'water': 'Water', 'oil': 'Oil', 'air': 'Air', 'glass': 'Glass',
    'earth_clock': 'Earth Clock', 'ship_clock': 'Ship Clock', 'time_dilation': 'Time Dilation', 'lorentz_factor': 'Lorentz Factor',
    'electrostatic_force': 'Electrostatic Force', 'drag_charges': 'Drag charges to adjust', 'proton': 'Proton', 'electron': 'Electron', 'sensor_mode': 'Sensor Mode', 'reset_charges': 'Reset Charges', 'charge_q1': 'Charge Q1', 'charge_q2': 'Charge Q2',
    'kirchhoff_analysis': 'Kirchhoff Analysis', 'total_source_v': 'Total Source V', 'total_drop_v': 'Total Drop V', 'power_gen': 'Power Gen', 'power_cons': 'Power Cons', 'voltage': 'Voltage', 'current': 'Current', 'resistance': 'Resistance', 'power': 'Power', 'voltage_drop': 'Voltage Drop', 'short_circuit': 'SHORT CIRCUIT', 'short_circuit_desc': 'Infinite current detected!', 'burnt': 'BURNT', 'open': 'Open', 'overload': 'OVERLOAD', 'select_comp_hint': 'Select a component to edit', 'quick_tutorial': 'Quick Tutorial', 'overheating_warning': 'Overheating Warning!',
    'series_rlc': 'SERIES RLC CIRCUIT', 'phasor': 'PHASOR DIAGRAM', 'phase': 'Phase', 'inductance': 'Inductance', 'capacitance': 'Capacitance',
    'medium_1': 'Medium 1', 'medium_2': 'Medium 2', 'total_internal_reflection': 'TOTAL INTERNAL REFLECTION', 'wavefronts': 'Wavefronts', 'protractor': 'Protractor', 'drag_laser': 'Drag Laser', 'refractive_index': 'Refractive Index',
    'auto_align_screen': 'AUTO ALIGN TO SCREEN', 'light_y_pos': 'Light Y Position', 'light_beam_angle': 'Light Beam Angle', 'prism_rotation': 'Prism Rotation', 'crown_glass': 'Crown Glass', 'flint_glass': 'Flint Glass', 'diamond': 'Diamond',
    'virtual_image': 'Virtual Image', 'real_image': 'Real Image', 'focal_length': 'Focal Length', 'object_dist': 'Object Dist',
    'crest': 'Crest (Peak +)', 'trough': 'Trough (Peak -)', 'node': 'Node (Zero)', 'wavelength': 'Wavelength', 'separation': 'Separation',
    'target_metal': 'Target Metal', 'photon_energy': 'Photon Energy', 'max_ke': 'Max KE', 'no_emission': 'NO EMISSION', 'stopping_voltage': 'Stopping Voltage', 'intensity': 'Intensity', 'sodium': 'Sodium', 'zinc': 'Zinc', 'copper': 'Copper', 'platinum': 'Platinum',
    'gas_properties': 'Gas Properties',
    'water_mass': 'Water Mass', 'water_temp': 'Water Temp', 'block_mass': 'Block Mass', 'block_temp': 'Block Temp', 'temp_plot': 'Temperature Plot', 'reset_lab': 'RESET LAB', 'drop_block': 'DROP BLOCK', 'water_label': 'Water', 'temp_axis': 'Temp (°C)', 'time_axis': 'Time', 'equilibrium_temp': 'Eq',
    'heat_in': 'Heat In', 'heat_out': 'Heat Out', 'insulated': 'Insulated', 'iso_exp': 'Isothermal Expansion', 'adia_exp': 'Adiabatic Expansion', 'iso_comp': 'Isothermal Compression', 'adia_comp': 'Adiabatic Compression', 'start_engine': 'START ENGINE', 'pause_engine': 'PAUSE ENGINE', 'sim_speed': 'Simulation Speed',
    
    // --- TOOLS ---
    'tool_cursor': 'Cursor', 'tool_battery': 'Battery', 'tool_wire': 'Wire', 'tool_resistor': 'Resistor', 'tool_bulb': 'Bulb', 'tool_switch': 'Switch', 'tool_voltmeter': 'Voltmeter', 'tool_ammeter': 'Ammeter', 'tool_ohmmeter': 'Ohmmeter', 'tutorial_step1': 'Select Battery', 'tutorial_step2': 'Place Battery', 'tutorial_step3': 'Select Wire', 'tutorial_step4': 'Connect', 'tutorial_step5': 'Add Load', 'tutorial_complete': 'Complete!',

    // --- EXPERIMENTS ---
    'mech-projectile': 'Projectile Motion', 'desc_mech-projectile': 'Simulate parabolic trajectories under gravity.',
    'mech-newton': 'Newton\'s Laws', 'desc_mech-newton': 'Explore Force, Mass, and Acceleration.',
    'mech-circular': 'Circular Motion', 'desc_mech-circular': 'Centripetal force and angular velocity.',
    'mech-pendulum': 'Simple Pendulum', 'desc_mech-pendulum': 'Harmonic motion, period, and frequency.',
    'mech-spring': 'Spring Oscillator', 'desc_mech-spring': 'Hooke\'s Law and damping.',
    'mech-torque': 'Torque & Equilibrium', 'desc_mech-torque': 'Balance forces on a lever.',
    'mech-collisions': 'Elastic Collisions', 'desc_mech-collisions': 'Momentum and energy conservation.',
    'mech-fluid': 'Archimedes Principle', 'desc_mech-fluid': 'Buoyancy and displacement.',
    'mech-relativity': 'Special Relativity', 'desc_mech-relativity': 'Time Dilation at high speeds.',
    'elec-coulomb': 'Coulomb\'s Law', 'desc_elec-coulomb': 'Electric force between charges.',
    'elec-field': 'Electric Fields', 'desc_elec-field': 'Map electric field lines.',
    'elec-ohm': 'Ohm\'s Law Circuit', 'desc_elec-ohm': 'Build DC circuits and measure V, I, R.',
    'elec-ac': 'AC RLC Circuits', 'desc_elec-ac': 'Alternating Current and Phase Shifts.',
    'opt-refraction': 'Refraction', 'desc_opt-refraction': 'Snell\'s Law and light bending.',
    'opt-prism': 'Prism Dispersion', 'desc_opt-prism': 'Light spectrum separation.',
    'opt-lenses': 'Lenses & Mirrors', 'desc_opt-lenses': 'Ray tracing for optics.',
    'opt-interference': 'Wave Interference', 'desc_opt-interference': 'Double-slit patterns.',
    'opt-photoelectric': 'Photoelectric Effect', 'desc_opt-photoelectric': 'Quantum light and electrons.',
    'therm-gas': 'Ideal Gas Law', 'desc_therm-gas': 'Pressure, Volume, Temperature relations.',
    'therm-calorimetry': 'Calorimetry', 'desc_therm-calorimetry': 'Heat transfer mixing.',
    'therm-carnot': 'Heat Engines', 'desc_therm-carnot': 'Thermodynamic cycles.',
    'Mechanics': 'Mechanics', 'Electricity': 'Electricity', 'Optics': 'Optics', 'Thermodynamics': 'Thermodynamics',

    // --- NOTEBOOK CONTENT (EN) ---
    'theory_mech-projectile': `# Projectile Motion
**1. Definition:** 
Projectile motion is a form of motion experienced by an object or particle (a projectile) that is projected near the Earth's surface and moves along a curved path under the action of gravity only (in particular, the effects of air resistance are assumed to be negligible).

**2. Independent Motions:**
The horizontal motion ($x$) and vertical motion ($y$) are independent.
*   **Horizontal:** Constant velocity ($a_x = 0$).
*   **Vertical:** Constant acceleration due to gravity ($a_y = -g$).

**3. Kinematic Equations:**
$$ x(t) = v_0 \cos(\theta) \cdot t $$
$$ y(t) = v_0 \sin(\theta) \cdot t - \frac{1}{2}gt^2 $$

**4. Derived Formulas:**
*   **Max Range ($R$):**
$$ R = \frac{v_0^2 \sin(2\theta)}{g} $$
*   **Max Height ($H$):**
$$ H = \frac{v_0^2 \sin^2\theta}{2g} $$
*   **Time of Flight ($T$):**
$$ T = \frac{2v_0 \sin\theta}{g} $$

**5. Variables:**
*   $v_0$: Initial velocity (m/s)
*   $\theta$: Launch angle (degrees)
*   $g$: Acceleration due to gravity ($9.8 m/s^2$)`,
    'guide_mech-projectile': `1. **Set Parameters:** Use the sliders to adjust **Velocity** and **Launch Angle**.
2. **Environment:** You can adjust **Gravity** (simulate Moon/Mars) or enable **Air Drag** to see realistic effects.
3. **Fire:** Press the **FIRE** button to launch.
4. **Target Mode:** Toggle 'Target Mode' to spawn a target. Drag the target to a new location and try to calculate the correct angle to hit it.
5. **Analyze:** Use the HUD to read the exact Max Height and Range of your shot.`,

    'theory_mech-newton': `# Newton's Second Law
**1. The Law:** 
The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object.

**2. The Equation:**
$$ \vec{F}_{\text{net}} = \sum \vec{F} = m \cdot \vec{a} $$

**3. Forces in this Simulation:**
*   **Thrust ($F_{\text{thrust}}$):** The driving force pushing the object forward.
*   **Friction ($f_k$):** The opposing force.
    *   Kinetic Friction: $f_k = \mu_k N = \mu_k m g$
    *   Net Force: $F_{\text{net}} = F_{\text{thrust}} - f_k$

**4. Variables:**
*   $F$: Force (Newtons, N)
*   $m$: Mass (Kilograms, kg)
*   $a$: Acceleration ($m/s^2$)
*   $\mu$: Coefficient of friction (dimensionless)`, 
    'guide_mech-newton': `1. **Apply Force:** Increase the **Thrust** slider.
2. **Observe Inertia:** Increase the **Mass**. Notice that for the same force, acceleration decreases ($a = F/m$).
3. **Friction:** Increase the **Friction** coefficient. If $F_{\text{thrust}} < F_{\text{friction}}$, the object won't move (Static Friction).
4. **Vectors:** Watch the arrows. Blue is Thrust, Red is Friction.`,

    'theory_mech-circular': `# Uniform Circular Motion
**1. Definition:** 
Motion of an object traveling at a constant speed on a circular path. Although speed is constant, velocity is NOT constant because the direction is changing.

**2. Centripetal Force:**
A net force that acts on an object to keep it moving along a circular path. It always points toward the center of rotation.

**3. Key Formulas:**
*   **Centripetal Acceleration ($a_c$):**
$$ a_c = \frac{v^2}{r} = \omega^2 r $$
*   **Centripetal Force ($F_c$):**
$$ F_c = m a_c = \frac{m v^2}{r} $$
*   **Linear vs Angular Velocity:**
$$ v = r \omega \quad \text{and} \quad \omega = \frac{2\pi}{T} $$

**4. Variables:**
*   $v$: Tangential velocity (m/s)
*   $\omega$: Angular velocity (rad/s)
*   $r$: Radius of orbit (m)
*   $T$: Period (s)`, 
    'guide_mech-circular': `1. **Parameters:** Adjust **Radius**, **Speed**, and **Mass**.
2. **Vectors:**
    *   **Yellow Vector:** Centripetal Force (Points to center). Note how it grows as $v^2$.
    *   **Red Vector:** Tangential Velocity (Points along the path).
3. **Experiment:** Try doubling the speed. Does the force double or quadruple? (Hint: $F \propto v^2$)`,

    'theory_mech-pendulum': `# Simple Pendulum
**1. Definition:** 
A simple pendulum consists of a mass $m$ hanging from a string of length $L$ and fixed at a pivot point. When displaced to an initial angle and released, the pendulum will swing back and forth with periodic motion.

**2. Small Angle Approximation:**
For small angles ($\theta < 15^\circ$), the motion approximates Simple Harmonic Motion (SHM).

**3. Formulas:**
*   **Period ($T$):** The time for one complete cycle.
$$ T \approx 2\pi \sqrt{\frac{L}{g}} $$
*   **Frequency ($f$):**
$$ f = \frac{1}{T} = \frac{1}{2\pi} \sqrt{\frac{g}{L}} $$

**4. Energy Conservation:**
$$ E_{\text{total}} = KE + PE = \frac{1}{2}mv^2 + mgh = \text{const} $$

**5. Note:** The period $T$ is independent of the Mass $m$.`, 
    'guide_mech-pendulum': `1. **Start:** Drag the bob to an angle and release it.
2. **Length:** Change the string **Length**. Notice that shorter strings swing faster.
3. **Gravity:** Change **Gravity**. Higher gravity makes it swing faster ($T \propto 1/\sqrt{g}$).
4. **Mass:** Change mass. Does the period change? (It shouldn't!).`,

    'theory_mech-spring': `# Spring Oscillator (SHM)
**1. Hooke's Law:** 
The force needed to extend or compress a spring by some distance $x$ scales linearly with respect to that distance.
$$ F_s = -k x $$
where $k$ is the spring constant (stiffness).

**2. Simple Harmonic Motion:**
The dynamics of the spring-mass system are described by:
$$ m \frac{d^2x}{dt^2} + kx = 0 $$

**3. Formulas:**
*   **Angular Frequency ($\omega$):**
$$ \omega = \sqrt{\frac{k}{m}} $$
*   **Period ($T$):**
$$ T = 2\pi \sqrt{\frac{m}{k}} $$

**4. Variables:**
*   $k$: Spring constant (N/m)
*   $x$: Displacement from equilibrium (m)`, 
    'guide_mech-spring': `1. **Excite:** Drag the mass block down and release to start oscillation.
2. **Stiffness:** Increase $k$. The spring becomes stiffer and oscillates faster.
3. **Mass:** Increase $m$. The system becomes sluggish and oscillates slower.
4. **Damping:** Increase damping to simulate air resistance. Watch the amplitude decay over time.`,

    'theory_mech-torque': `# Torque & Equilibrium
**1. Torque ($\tau$):** 
Torque is the rotational equivalent of linear force. It represents the capability of a force to produce change in the rotational motion of the body.
$$ \tau = r \cdot F \cdot \sin(\theta) $$
In this simulation, forces are perpendicular ($\theta=90^\circ$), so $\tau = r \cdot F$.

**2. Conditions for Equilibrium:**
For a rigid body to be in static equilibrium:
1.  Sum of Forces = 0
2.  Sum of Torques = 0
$$ \sum \tau_{\text{cw}} = \sum \tau_{\text{ccw}} $$
$$ m_1 g d_1 = m_2 g d_2 $$

**3. Variables:**
*   $d$: Distance from pivot (lever arm)
*   $F$: Force (Weight $mg$)`, 
    'guide_mech-torque': `1. **Challenge:** Place a 5kg mass at distance 4 on the left.
2. **Solve:** Where must you place a 10kg mass on the right to balance it?
    *   Calculation: $5 \times 4 = 20$. So $10 \times d_2 = 20 \rightarrow d_2 = 2$.
3. **Verify:** Place the mass and see if the beam levels out.`,

    'theory_mech-collisions': `# Elastic Collisions
**1. Conservation of Momentum:** 
In an isolated system, the total momentum is constant before and after collision.
$$ p = mv $$
$$ m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2' $$

**2. Conservation of Kinetic Energy:** 
In a perfectly elastic collision, total kinetic energy is also conserved.
$$ \frac{1}{2}m_1 v_1^2 + \frac{1}{2}m_2 v_2^2 = \frac{1}{2}m_1 v_1'^2 + \frac{1}{2}m_2 v_2'^2 $$

**3. Special Case (Equal Mass):**
If $m_1 = m_2$, the objects simply exchange velocities.`, 
    'guide_mech-collisions': `1. **Setup:** Choose masses and initial velocities for the Blue and Red balls.
2. **Simulate:** Press Play.
3. **Observe:** Watch how they bounce.
    *   Try $m_1 \gg m_2$: The heavy ball barely slows down, the light ball flies away fast.
    *   Try $m_1 = m_2$ and $v_2 = 0$: The first ball stops dead, the second takes all the speed (Newton's Cradle effect).`,

    'theory_mech-fluid': `# Archimedes' Principle
**1. The Principle:** 
Any object, wholly or partially immersed in a fluid, is buoyed up by a force equal to the weight of the fluid displaced by the object.

**2. Buoyant Force ($F_b$):**
$$ F_b = \rho_{\text{fluid}} \cdot g \cdot V_{\text{displaced}} $$

**3. Flotation Condition:**
*   If $F_b > \text{Weight}$, object floats.
*   If $F_b < \text{Weight}$, object sinks.
*   Floating objects displace their own weight in fluid.

**4. Apparent Weight:**
The weight measured while submerged is less than air weight.
$$ W_{\text{apparent}} = W_{\text{air}} - F_b $$`, 
    'guide_mech-fluid': `1. **Weigh:** Note the weight of the object in air.
2. **Submerge:** Drag the slider to lower the object into the water.
3. **Observe:**
    *   Water level rises (Displacement).
    *   Water flows out into the catch bucket.
    *   The Scale Reading decreases.
4. **Proof:** Check that $F_b$ (Buoyancy) is exactly equal to the weight of the "Displaced" fluid.`,

    'theory_mech-relativity': `# Special Relativity: Time Dilation
**1. The Concept:** 
Time is not absolute. According to Einstein's theory of Special Relativity, a clock that is moving relative to an observer will be measured to tick slower than a clock that is at rest in the observer's frame.

**2. The Formula:**
$$ \Delta t = \frac{\Delta t_0}{\sqrt{1 - \frac{v^2}{c^2}}} = \gamma \Delta t_0 $$

**3. Variables:**
*   $\Delta t$: Time interval measured by stationary observer (Earth).
*   $\Delta t_0$: Proper time (measured by observer on the moving ship).
*   $v$: Relative velocity.
*   $c$: Speed of light ($\approx 3 \times 10^8$ m/s).
*   $\gamma$: Lorentz factor (always $\ge 1$).`, 
    'guide_mech-relativity': `1. **Accelerate:** Increase the velocity slider towards 99% of $c$.
2. **Light Clock:** Observe the photon on the ship. It has to travel a longer, diagonal path (Zig-Zag). Since $c$ is constant, this takes longer.
3. **Compare:** Notice the "Ship Clock" ticking much slower than the "Earth Clock".`,

    'theory_elec-coulomb': `# Coulomb's Law
**1. The Law:** 
The magnitude of the electrostatic force of attraction or repulsion between two point charges is directly proportional to the product of the magnitudes of charges and inversely proportional to the square of the distance between them.

**2. Formula:**
$$ F = k_e \frac{|q_1 q_2|}{r^2} $$

**3. Variables:**
*   $F$: Electrostatic force (N)
*   $k_e$: Coulomb constant ($8.99 \times 10^9 \, \text{N}\cdot\text{m}^2/\text{C}^2$)
*   $q_1, q_2$: Signed magnitudes of charges (Coulombs)
*   $r$: Distance between centers (m)

**4. Direction:**
*   Like charges ($+,+$ or $-,-$) repel.
*   Opposite charges ($+,-$) attract.`, 
    'guide_elec-coulomb': `1. **Interact:** Drag the charges closer and further apart.
2. **Inverse Square Law:** Notice that halving the distance ($r/2$) makes the force $4\times$ stronger.
3. **Polarity:** Change one charge to negative. The force vectors flip from pointing OUT (Repulsion) to pointing IN (Attraction).`,

    'theory_elec-field': `# Electric Field
**1. Definition:** 
An electric field is a vector field that associates to each point in space the Coulomb force that would be experienced per unit of electric charge, by an infinitesimal test charge at that point.

**2. Field of a Point Charge:**
$$ \vec{E} = k_e \frac{q}{r^2} \hat{r} $$

**3. Superposition Principle:**
The total electric field created by multiple charges is the vector sum of their individual fields.
$$ \vec{E}_{\text{total}} = \vec{E}_1 + \vec{E}_2 + \dots $$

**4. Visualization:**
*   Field lines originate from Positive charges.
*   Field lines terminate on Negative charges.
*   Density of lines indicates field strength.`, 
    'guide_elec-field': `1. **Create:** Click buttons to add Proton (+) and Electron (-) charges.
2. **Dipole:** Place one (+) and one (-) to see the classic dipole pattern.
3. **Sensor:** Toggle 'Sensor Mode' and move your mouse. The yellow vector shows the direction and magnitude of the force a test charge would feel.`,

    'theory_elec-ohm': `# Ohm's Law & DC Circuits
**1. Ohm's Law:** 
The current through a conductor between two points is directly proportional to the voltage across the two points.
$$ I = \frac{V}{R} $$
*   $I$: Current (Amperes, A)
*   $V$: Voltage (Volts, V)
*   $R$: Resistance (Ohms, $\Omega$)

**2. Electrical Power:**
The rate at which electrical energy is converted into other forms (heat, light).
$$ P = V \cdot I = I^2 R $$

**3. Kirchhoff's Laws:**
*   **KVL:** The sum of all voltages around a closed loop is zero.
*   **KCL:** The sum of currents entering a junction equals the sum leaving.`, 
    'guide_elec-ohm': `1. **Build:** Use the toolbar to place a Battery and a Resistor.
2. **Wire:** Connect them with wires to form a closed loop.
3. **Inspect:** Hover over the resistor to see Current ($I$) and Power ($P$).
4. **Tools:** Select the Voltmeter probe and measure the voltage drop across the resistor. It should match the battery voltage.`,

    'theory_elec-ac': `# AC Circuits (RLC)
**1. Alternating Current:** 
Electric current which periodically reverses direction.
$$ V(t) = V_{\text{max}} \sin(\omega t) $$

**2. Reactance & Impedance:**
*   Inductive Reactance: $X_L = \omega L$
*   Capacitive Reactance: $X_C = \frac{1}{\omega C}$
*   **Impedance ($Z$):** The total opposition to current.
$$ Z = \sqrt{R^2 + (X_L - X_C)^2} $$

**3. Phase Shift ($\phi$):**
In an RLC circuit, voltage and current are not in phase.
$$ \tan \phi = \frac{X_L - X_C}{R} $$
*   If $X_L > X_C$: Inductive (Voltage leads Current).
*   If $X_C > X_L$: Capacitive (Current leads Voltage).`, 
    'guide_elec-ac': `1. **Observe:** The Phasor diagram shows rotating vectors for $V$ (Red) and $I$ (Blue).
2. **Lag/Lead:** Adjust the Frequency. At low freq, Capacitor dominates ($X_C$ is large). At high freq, Inductor dominates.
3. **Resonance:** Try to make $X_L = X_C$. At this point, $Z$ is minimum ($Z=R$), current is maximum, and Phase $\phi = 0$.`,

    'theory_opt-refraction': `# Refraction & Snell's Law
**1. Refraction:** 
The change in direction of a wave passing from one medium to another caused by its change in speed.

**2. Index of Refraction ($n$):**
$$ n = \frac{c}{v} $$
where $c$ is speed of light in vacuum, $v$ is speed in the medium.

**3. Snell's Law:**
$$ n_1 \sin(\theta_1) = n_2 \sin(\theta_2) $$
*   $\theta_1$: Angle of incidence (relative to normal)
*   $\theta_2$: Angle of refraction

**4. Total Internal Reflection:**
Occurs when light travels from dense ($n_1$) to rare ($n_2$) medium at an angle greater than critical angle:
$$ \theta_c = \arcsin\left(\frac{n_2}{n_1}\right) $$`, 
    'guide_opt-refraction': `1. **Control:** Drag the Laser handle to change the incident angle.
2. **Materials:** Change Medium 2 to 'Glass'. Notice the light bends *towards* the normal (line).
3. **TIR:** Make Medium 1 'Glass' and Medium 2 'Air'. Increase the angle until the refracted ray disappears (Total Internal Reflection).`,

    'theory_opt-prism': `# Prism Dispersion
**1. Dispersion:** 
The phenomenon where the phase velocity of a wave depends on its frequency. In optics, this means different colors of light travel at different speeds in glass.

**2. Cauchy's Equation:**
The refractive index $n$ is not constant but a function of wavelength $\lambda$:
$$ n(\lambda) = A + \frac{B}{\lambda^2} $$
*   Short wavelengths (Blue/Violet) have higher $n$, so they bend more.
*   Long wavelengths (Red) have lower $n$, so they bend less.

**3. Spectrum:**
This differential bending separates white light into its constituent spectral colors (ROYGBIV).`, 
    'guide_opt-prism': `1. **Setup:** Use 'Auto Align' to position the prism.
2. **Observe:** The white beam enters, bends, and splits into a rainbow on the screen.
3. **Compare:** Change material to 'Flint Glass' (higher dispersion) vs 'Crown Glass'. Flint creates a wider rainbow.`,

    'theory_opt-lenses': `# Thin Lens Equation
**1. The Lens Maker's Equation:** 
Relates the focal length ($f$), object distance ($d_o$), and image distance ($d_i$).
$$ \frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i} $$

**2. Magnification ($m$):**
$$ m = -\frac{d_i}{d_o} = \frac{h_i}{h_o} $$

**3. Sign Convention:**
*   $f > 0$: Convex (Converging) Lens.
*   $f < 0$: Concave (Diverging) Lens.
*   $d_i > 0$: Real Image (inverted).
*   $d_i < 0$: Virtual Image (upright).`, 
    'guide_opt-lenses': `1. **Interactive:** Drag the Candle (Object) back and forth.
2. **Real Image:** Place object outside the focal point ($d_o > f$). Rays converge to form a real, inverted image.
3. **Virtual Image:** Place object inside focal point ($d_o < f$). Rays diverge, forming a magnified, virtual, upright image (Magnifying glass mode).`,

    'theory_opt-interference': `# Wave Interference (Young's Double Slit)
**1. Principle of Superposition:** 
When two waves overlap, the resulting displacement is the algebraic sum of individual displacements.

**2. Path Difference ($\Delta d$):**
The difference in distance traveled by waves from two sources ($S_1, S_2$) to a point $P$.
$$ \Delta d = d \sin \theta $$

**3. Interference Conditions:**
*   **Constructive (Bright Fringe):** Waves arrive in phase.
$$ \Delta d = k \lambda \quad (k=0, 1, 2\dots) $$
*   **Destructive (Dark Fringe):** Waves arrive out of phase.
$$ \Delta d = (k + 0.5) \lambda $$`, 
    'guide_opt-interference': `1. **Parameters:** Adjust the 'Separation' between slits.
2. **Wavelength:** Change color. Red light ($\lambda \approx 700$nm) produces wider fringes than Blue ($\lambda \approx 400$nm).
3. **Visual:** Observe the 'Nodal Lines' (grey rays) where waves cancel out.`,

    'theory_opt-photoelectric': `# Photoelectric Effect
**1. The Phenomenon:** 
The emission of electrons when electromagnetic radiation (light) hits a material. This experiment proved the *particle nature* of light (photons).

**2. Photon Energy:**
$$ E = hf = \frac{hc}{\lambda} $$
*   $h$: Planck's constant

**3. Einstein's Photoelectric Equation:**
$$ K_{\text{max}} = hf - \Phi $$
*   $K_{\text{max}}$: Maximum Kinetic Energy of electron.
*   $\Phi$: Work Function (Min energy to bind electron to metal).

**4. Threshold:**
Emission only happens if $hf > \Phi$. Intensity only increases the *number* of electrons, not their energy.`, 
    'guide_opt-photoelectric': `1. **Threshold:** Start with Red light. For Sodium, nothing happens.
2. **Energy:** Decrease wavelength (towards Blue/UV). Suddenly, electrons are ejected!
3. **Stopping Voltage:** Apply a negative voltage to repel electrons. The voltage needed to stop the fastest electron gives you $K_{\text{max}}$.`,

    'theory_therm-gas': `# Ideal Gas Law
**1. Equation of State:** 
Describes the behavior of a hypothetical ideal gas.
$$ pV = nRT $$
*   $p$: Pressure (Pascal, Pa)
*   $V$: Volume ($m^3$)
*   $n$: Number of moles
*   $R$: Gas constant
*   $T$: Absolute Temperature (Kelvin, K)

**2. Kinetic Molecular Theory:**
*   Temperature is a measure of the average kinetic energy of particles.
*   Pressure is caused by collisions of particles with container walls.
$$ KE_{\text{avg}} = \frac{3}{2} k_B T $$`, 
    'guide_therm-gas': `1. **Isochoric (Constant V):** Increase Temperature. Observe particles moving faster and hitting walls harder $\rightarrow$ Pressure rises.
2. **Isothermal (Constant T):** Compress the volume. Particles hit walls more frequently $\rightarrow$ Pressure rises.
3. **Particles:** Pump in more gas ($n$). Pressure increases linearly.`,

    'theory_therm-calorimetry': `# Calorimetry & Heat Transfer
**1. Specific Heat Capacity ($c$):** 
The amount of heat energy required to raise the temperature of 1 kg of a substance by 1 Kelvin.
$$ Q = mc \Delta T $$

**2. Principle of Calorimetry:**
In an isolated system (no heat loss to surroundings):
$$ Q_{\text{lost}} + Q_{\text{gained}} = 0 $$
$$ m_{\text{hot}} c_{\text{hot}} (T_f - T_{\text{hot}}) + m_{\text{cold}} c_{\text{cold}} (T_f - T_{\text{cold}}) = 0 $$

**3. Equilibrium Temperature:**
The final temperature $T_f$ reached when both substances stabilize.`, 
    'guide_therm-calorimetry': `1. **Prepare:** Set the mass and temp of the Water and the Metal Block.
2. **Drop:** Drop the hot block into cold water.
3. **Trace:** Watch the graph. The water warms up, the block cools down. They meet at the **Equilibrium Temperature**.`,

    'theory_therm-carnot': `# The Carnot Cycle
**1. Definition:** 
A theoretical thermodynamic cycle proposed by Nicolas Léonard Sadi Carnot. It provides an upper limit on the efficiency that any classical thermodynamic engine can achieve.

**2. The 4 Stages:**
1.  **Isothermal Expansion:** Gas expands at constant $T_H$, absorbing heat $Q_{\text{in}}$.
2.  **Adiabatic Expansion:** Gas expands without heat transfer, cooling to $T_C$.
3.  **Isothermal Compression:** Gas compresses at constant $T_C$, rejecting heat $Q_{\text{out}}$.
4.  **Adiabatic Compression:** Gas compresses, warming back to $T_H$.

**3. Carnot Efficiency:**
$$ \eta = 1 - \frac{T_C}{T_H} $$`, 
    'guide_therm-carnot': `1. **Start:** Run the engine.
2. **P-V Diagram:** Follow the yellow dot. The area inside the loop represents the **Work Done** per cycle.
3. **Visuals:**
    *   Red Cylinder Base: Heat Injection ($Q_{\text{in}}$).
    *   Blue Cylinder Base: Heat Rejection ($Q_{\text{out}}$).
    *   Grey Base: Insulation (Adiabatic).`,
  },

  vi: {
    // --- UI GENERAL ---
    'search_placeholder': 'Tìm kiếm thí nghiệm...',
    'system_active': 'Hệ Thống Đang Chạy',
    'created_by': 'Thiết kế bởi',
    'author_name': 'PHÚC ĐỖ',
    'theory_guide': 'Sổ Tay Vật Lý',
    'theory': 'Lý Thuyết',
    'guide': 'Hướng Dẫn',
    'physics_concepts': 'Khái Niệm Vật Lý',
    'theory_subtitle': 'Định nghĩa & Công thức chuẩn SGK',
    'interactive_guide': 'Hướng Dẫn Thực Hành',
    'guide_subtitle': 'Các bước mô phỏng chi tiết',
    'pro_tip': 'Mẹo Hay',
    'pro_tip_content': 'Để hiểu rõ bản chất vật lý, hãy chỉ thay đổi một thông số tại một thời điểm và giữ nguyên các thông số còn lại.',

    // --- LABELS ---
    'velocity': 'Vận tốc', 'angle': 'Góc ném', 'height': 'Độ cao', 'gravity': 'Gia tốc trọng trường', 'drag': 'Lực cản không khí',
    'mass': 'Khối lượng', 'friction': 'Hệ số ma sát', 'thrust': 'Lực đẩy', 'tension': 'Lực căng dây',
    'time': 'Thời gian', 'range': 'Tầm xa', 'period': 'Chu kỳ', 'frequency': 'Tần số',
    'length': 'Chiều dài', 'stiffness': 'Độ cứng (k)', 'damping': 'Độ tắt dần', 'position': 'Vị trí',
    'pressure': 'Áp Suất', 'temp': 'Nhiệt Độ', 'volume': 'Thể Tích', 'particles': 'Số lượng hạt',
    'stop': 'Dừng', 'fire': 'Bắn', 'pause': 'Tạm dừng', 'simulate': 'Mô phỏng', 'start': 'Bắt đầu',
    'slow_motion': 'Quay Chậm', 'real_time': 'Thực Tế',
    
    // --- SIMULATION SPECIFIC ---
    'flight_data': 'Thông Số Bay', 'target_mode': 'Chế độ Bia Bắn', 'target_hit': 'TRÚNG MỤC TIÊU', 'target_distance': 'Khoảng Cách Bia', 'drag_to_move': 'Kéo để di chuyển',
    'oscillation_data': 'Số Liệu Dao Động', 'equilibrium_line': 'Vị trí cân bằng', 'graph_pos_time': 'Đồ thị Tọa độ - Thời gian', 'drag_to_start': 'Kéo vật để bắt đầu',
    'orbit_radius': 'Bán Kính Quỹ Đạo', 'angular_vel': 'Tốc Độ Góc', 'vel_tangent': 'Vận Tốc Dài', 'centripetal_force': 'Lực Hướng Tâm',
    'acceleration': 'Gia tốc', 'dynamics_controls': 'Bảng Điều Khiển Động Lực', 'locked_friction': 'ĐỨNG YÊN (Ma sát nghỉ)', 'need_force': 'Cần lực đẩy >',
    'left_object': 'Vật bên Trái', 'right_object': 'Vật bên Phải', 'torque': 'Mô-men lực', 'equilibrium': 'Trạng Thái Cân Bằng', 'rotating_cw': 'Quay Cùng Chiều KĐH', 'rotating_ccw': 'Quay Ngược Chiều KĐH', 'balanced': 'Đã Cân Bằng',
    'momentum': 'Động Lượng', 'kinetic': 'Động Năng', 'object_1': 'Vật 1', 'object_2': 'Vật 2', 'obj_1_blue': 'Vật 1 (Xanh)', 'obj_2_red': 'Vật 2 (Đỏ)',
    'arch_physics_data': 'Số Liệu Đo Đạc', 'arch_weight': 'Trọng Lượng (Không khí)', 'arch_obj_density': 'KLR Vật', 'arch_fluid_density': 'KLR Chất Lỏng', 'arch_buoyancy': 'Lực Đẩy Ác-si-mét', 'arch_scale': 'Số Chỉ Lực Kế', 'arch_lower': 'Hạ Vật Xuống', 'arch_material': 'Chất Liệu Vật', 'arch_liquid': 'Môi Trường Lỏng', 'arch_reset_pos': 'Kéo Lên', 'floating': 'VẬT NỔI', 'displaced': 'Nước Tràn',
    'brick': 'Gạch', 'gold': 'Vàng', 'wood': 'Gỗ', 'water': 'Nước', 'oil': 'Dầu', 'air': 'Không khí', 'glass': 'Thủy tinh',
    'earth_clock': 'Đồng Hồ Trái Đất', 'ship_clock': 'Đồng Hồ Trên Tàu', 'time_dilation': 'Giãn Nở Thời Gian', 'lorentz_factor': 'Hệ số Lorentz',
    'electrostatic_force': 'Lực Tĩnh Điện', 'drag_charges': 'Kéo điện tích để thay đổi vị trí', 'proton': 'Proton (+)', 'electron': 'Electron (-)', 'sensor_mode': 'Chế độ Cảm Biến Điện Trường', 'reset_charges': 'Xóa Tất Cả', 'charge_q1': 'Điện Tích Q1', 'charge_q2': 'Điện Tích Q2',
    'kirchhoff_analysis': 'Phân Tích Mạch (Kirchhoff)', 'total_source_v': 'Tổng Thế Nguồn', 'total_drop_v': 'Tổng Sụt Áp', 'power_gen': 'Công Suất Nguồn', 'power_cons': 'Công Suất Tiêu Thụ', 'voltage': 'Hiệu Điện Thế', 'current': 'Cường Độ Dòng', 'resistance': 'Điện Trở', 'power': 'Công Suất', 'voltage_drop': 'Sụt Áp', 'short_circuit': 'ĐOẢN MẠCH!', 'short_circuit_desc': 'Dòng điện tăng vọt vô hạn! Nguy hiểm.', 'burnt': 'HỎNG', 'open': 'Mở', 'overload': 'QUÁ TẢI', 'select_comp_hint': 'Chọn một linh kiện để xem thông số', 'quick_tutorial': 'Hướng Dẫn Nhanh', 'overheating_warning': 'Cảnh Báo Quá Nhiệt!',
    'series_rlc': 'MẠCH RLC NỐI TIẾP', 'phasor': 'GIẢN ĐỒ VECTƠ (FRESNEL)', 'phase': 'Độ Lệch Pha', 'inductance': 'Độ Tự Cảm (L)', 'capacitance': 'Điện Dung (C)',
    'medium_1': 'Môi Trường Tới', 'medium_2': 'Môi Trường Khúc Xạ', 'total_internal_reflection': 'PHẢN XẠ TOÀN PHẦN', 'wavefronts': 'Xem Mặt Sóng', 'protractor': 'Thước Đo Độ', 'drag_laser': 'Kéo đèn Laser để chỉnh góc', 'refractive_index': 'Chiết Suất (n)',
    'auto_align_screen': 'TỰ ĐỘNG CĂN CHỈNH', 'light_y_pos': 'Độ Cao Đèn', 'light_beam_angle': 'Góc Chiếu Sáng', 'prism_rotation': 'Xoay Lăng Kính', 'crown_glass': 'Thủy Tinh Crown', 'flint_glass': 'Thủy Tinh Flint', 'diamond': 'Kim Cương',
    'virtual_image': 'Ảnh Ảo (Cùng chiều)', 'real_image': 'Ảnh Thật (Ngược chiều)', 'focal_length': 'Tiêu Cự (f)', 'object_dist': 'Khoảng Cách Vật (d)',
    'crest': 'Đỉnh Sóng (+)', 'trough': 'Đáy Sóng (-)', 'node': 'Nút Sóng (0)', 'wavelength': 'Bước Sóng', 'separation': 'Khoảng Cách 2 Khe',
    'target_metal': 'Kim Loại Catốt', 'photon_energy': 'Năng Lượng Photon', 'max_ke': 'Động Năng Max', 'no_emission': 'KHÔNG PHÁT XẠ (λ > λ₀)', 'stopping_voltage': 'Hiệu Điện Thế Hãm', 'intensity': 'Cường Độ Sáng', 'sodium': 'Natri', 'zinc': 'Kẽm', 'copper': 'Đồng', 'platinum': 'Bạch Kim',
    'gas_properties': 'Thông Số Trạng Thái',
    'water_mass': 'Khối Lượng Nước', 'water_temp': 'Nhiệt Độ Nước', 'block_mass': 'Khối Lượng Vật', 'block_temp': 'Nhiệt Độ Vật', 'temp_plot': 'Đồ Thị Nhiệt Độ', 'reset_lab': 'LÀM LẠI', 'drop_block': 'THẢ VẬT', 'water_label': 'Nước', 'temp_axis': 'Nhiệt Độ (°C)', 'time_axis': 'Thời Gian', 'equilibrium_temp': 'Nhiệt độ Cân Bằng',
    'heat_in': 'Nhận Nhiệt', 'heat_out': 'Tỏa Nhiệt', 'insulated': 'Cách Nhiệt (Q=0)', 'iso_exp': 'Giãn Đẳng Nhiệt', 'adia_exp': 'Giãn Đoạn Nhiệt', 'iso_comp': 'Nén Đẳng Nhiệt', 'adia_comp': 'Nén Đoạn Nhiệt', 'start_engine': 'CHẠY ĐỘNG CƠ', 'pause_engine': 'DỪNG ĐỘNG CƠ', 'sim_speed': 'Tốc Độ Mô Phỏng',
    'control_center': 'Bảng Điều Khiển', 'measurements': 'Đo Đạc', 'remove_comp': 'Xóa', 'clear_all': 'Xóa Hết',

    // --- EXPERIMENTS ---
    'mech-projectile': 'Chuyển Động Ném Xiên', 'desc_mech-projectile': 'Mô phỏng quỹ đạo ném xiên dưới tác dụng của trọng lực.',
    'mech-newton': 'Định Luật II Newton', 'desc_mech-newton': 'Khám phá mối quan hệ giữa Lực, Khối lượng và Gia tốc.',
    'mech-circular': 'Chuyển Động Tròn Đều', 'desc_mech-circular': 'Lực hướng tâm, vận tốc góc và gia tốc hướng tâm.',
    'mech-pendulum': 'Con Lắc Đơn', 'desc_mech-pendulum': 'Nghiên cứu chu kỳ dao động phụ thuộc vào chiều dài dây.',
    'mech-spring': 'Con Lắc Lò Xo', 'desc_mech-spring': 'Định luật Hooke, động năng, thế năng và dao động tắt dần.',
    'mech-torque': 'Cân Bằng Vật Rắn & Mô-men', 'desc_mech-torque': 'Quy tắc Mô-men lực và điều kiện cân bằng của đòn bẩy.',
    'mech-collisions': 'Va Chạm Đàn Hồi', 'desc_mech-collisions': 'Định luật bảo toàn Động Lượng và Động Năng.',
    'mech-fluid': 'Nguyên Lý Ác-si-mét', 'desc_mech-fluid': 'Sự nổi, lực đẩy Ác-si-mét và thể tích chiếm chỗ.',
    'mech-relativity': 'Thuyết Tương Đối Hẹp', 'desc_mech-relativity': 'Sự giãn nở thời gian ở vận tốc gần ánh sáng.',
    'elec-coulomb': 'Định Luật Coulomb', 'desc_elec-coulomb': 'Lực tương tác tĩnh điện giữa các điện tích điểm.',
    'elec-field': 'Điện Trường', 'desc_elec-field': 'Hình ảnh đường sức điện và nguyên lý chồng chất điện trường.',
    'elec-ohm': 'Mạch Định Luật Ohm', 'desc_elec-ohm': 'Lắp ráp mạch DC: Định luật Ohm, Kirchhoff và Công suất.',
    'elec-ac': 'Mạch Điện Xoay Chiều RLC', 'desc_elec-ac': 'Tổng trở, Độ lệch pha và Cộng hưởng điện.',
    'opt-refraction': 'Khúc Xạ Ánh Sáng', 'desc_opt-refraction': 'Định luật Snell và hiện tượng phản xạ toàn phần.',
    'opt-prism': 'Tán Sắc Lăng Kính', 'desc_opt-prism': 'Sự phân tách ánh sáng trắng thành quang phổ qua lăng kính.',
    'opt-lenses': 'Thấu Kính Mỏng', 'desc_opt-lenses': 'Tạo ảnh qua thấu kính hội tụ/phân kì. Công thức thấu kính.',
    'opt-interference': 'Giao Thoa Sóng', 'desc_opt-interference': 'Thí nghiệm Young: Vân sáng, vân tối và bước sóng.',
    'opt-photoelectric': 'Hiệu Ứng Quang Điện', 'desc_opt-photoelectric': 'Tính chất hạt của ánh sáng, công thoát và hệ thức Einstein.',
    'therm-gas': 'Khí Lý Tưởng', 'desc_therm-gas': 'Định luật Boyle, Charles và Phương trình trạng thái.',
    'therm-calorimetry': 'Nhiệt Lượng Kế', 'desc_therm-calorimetry': 'Sự truyền nhiệt và phương trình cân bằng nhiệt.',
    'therm-carnot': 'Động Cơ Nhiệt Carnot', 'desc_therm-carnot': 'Chu trình nhiệt động lực học lí tưởng và hiệu suất cực đại.',
    'Mechanics': 'Cơ Học', 'Electricity': 'Điện Học', 'Optics': 'Quang Học', 'Thermodynamics': 'Nhiệt Học',

    // --- NOTEBOOK CONTENT (VI) ---
    'theory_mech-projectile': `# Chuyển Động Ném Xiên
**1. Định Nghĩa:**
Chuyển động ném xiên là chuyển động của một vật được ném lên với vận tốc ban đầu $\\vec{v}_0$ hợp với phương ngang một góc $\\alpha$. Vật chỉ chịu tác dụng của trọng lực (bỏ qua lực cản không khí).

**2. Phân Tích Chuyển Động:**
Chuyển động này là tổng hợp của hai chuyển động thành phần độc lập:
*   **Theo phương ngang ($Ox$):** Chuyển động thẳng đều.
    $$ v_x = v_0 \\cos\\alpha $$
    $$ x = (v_0 \\cos\\alpha)t $$
*   **Theo phương thẳng đứng ($Oy$):** Chuyển động biến đổi đều (ném lên thẳng đứng).
    $$ v_y = v_0 \\sin\\alpha - gt $$
    $$ y = (v_0 \\sin\\alpha)t - \\frac{1}{2}gt^2 $$

**3. Các Công Thức Quan Trọng:**
*   **Tầm xa cực đại ($L$):** (Khi $y=0$)
$$ L = \\frac{v_0^2 \\sin(2\\alpha)}{g} $$
*   **Độ cao cực đại ($H$):** (Khi $v_y=0$)
$$ H = \\frac{v_0^2 \\sin^2\\alpha}{2g} $$
*   **Thời gian bay ($t$):**
$$ t = \\frac{2v_0 \\sin\\alpha}{g} $$
*   **Quỹ đạo:** Có dạng một đường Parabol bề lõm quay xuống dưới.

**4. Đại Lượng & Đơn Vị:**
*   $v_0$: Vận tốc đầu ($m/s$)
*   $\\alpha$: Góc ném (độ hoặc rad)
*   $g$: Gia tốc trọng trường (thường lấy $9.8$ hoặc $10 \\, m/s^2$)
*   $x, y, L, H$: Độ dài ($m$)`,
    'guide_mech-projectile': `1. **Thiết lập:** Sử dụng thanh trượt để điều chỉnh **Vận tốc đầu** ($v_0$) và **Góc ném** ($\\alpha$).
2. **Môi trường:** Bạn có thể thay đổi gia tốc trọng trường $g$ để mô phỏng ném vật trên Mặt Trăng ($g=1.6$) hoặc Sao Hỏa.
3. **Thực hành:**
    *   Bật **Chế độ Bia Bắn**.
    *   Kéo bia ra một vị trí bất kỳ.
    *   Tính toán hoặc ước lượng góc ném phù hợp để trúng bia.
4. **Phân tích:** Sau khi bắn, quan sát bảng **Dữ Liệu Bay** để xem các thông số thực tế đạt được.`,

    'theory_mech-newton': `# Định Luật II Newton
**1. Phát Biểu:**
Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật.

**2. Biểu Thức Vector:**
$$ \\vec{F}_{\\text{net}} = m \\cdot \\vec{a} $$
Trong đó $\\vec{F}_{\\text{net}}$ là hợp lực của tất cả các lực tác dụng lên vật.

**3. Phân Tích Lực trong Mô Phỏng:**
Vật chịu tác dụng của các lực theo phương ngang:
*   **Lực Đẩy ($F_{\\text{thrust}}$):** Lực phát động cơ giúp vật tăng tốc.
*   **Lực Ma Sát ($F_{\\text{ms}}$):** Lực cản trở chuyển động, luôn ngược chiều vận tốc.
    *   Ma sát trượt: $F_{\\text{mst}} = \\mu m g$
*   **Phương trình động lực học:**
    $$ F_{\\text{thrust}} - F_{\\text{ms}} = m \\cdot a $$

**4. Đại Lượng:**
*   $F$: Lực (Newton, N)
*   $m$: Khối lượng (kg). Là đại lượng đặc trưng cho **mức quán tính** của vật.
*   $a$: Gia tốc ($m/s^2$)`, 
    'guide_mech-newton': `1. **Tăng tốc:** Kéo thanh **Lực Đẩy** lên cao. Vật sẽ chuyển động nhanh dần đều.
2. **Quán tính:** Hãy thử tăng **Khối Lượng** lên tối đa. Với cùng một lực đẩy, gia tốc sẽ nhỏ đi rất nhiều (vật "lì" hơn).
3. **Ma sát:** Tăng hệ số ma sát. Nếu $F_{\\text{đẩy}} < F_{\\text{ma sát nghỉ}}$, vật sẽ không nhúc nhích.
4. **Quan sát:** Chú ý độ dài của vector gia tốc (màu xanh lá) thay đổi theo các thông số.`,

    'theory_mech-circular': `# Chuyển Động Tròn Đều
**1. Định Nghĩa:**
Chuyển động tròn đều là chuyển động có quỹ đạo tròn và tốc độ dài không đổi.
*Lưu ý:* Tuy tốc độ không đổi, nhưng **vận tốc** (vector) luôn đổi hướng, do đó luôn có gia tốc.

**2. Lực Hướng Tâm:**
Là hợp lực tác dụng lên vật gây ra gia tốc hướng tâm, giữ cho vật đi theo quỹ đạo tròn.
$$ \\vec{F}_{\\text{ht}} = m \\cdot \\vec{a}_{\\text{ht}} $$

**3. Các Công Thức:**
*   **Gia tốc hướng tâm:** Luôn hướng vào tâm quỹ đạo.
$$ a_{\\text{ht}} = \\frac{v^2}{r} = \\omega^2 r $$
*   **Lực hướng tâm:**
$$ F_{\\text{ht}} = \\frac{m v^2}{r} $$
*   **Mối liên hệ $v$ và $\\omega$:**
$$ v = \\omega r $$

**4. Đại Lượng:**
*   $\\omega$: Tốc độ góc (rad/s)
*   $v$: Tốc độ dài (m/s)
*   $r$: Bán kính quỹ đạo (m)
*   $T$: Chu kỳ (s) - Thời gian đi hết 1 vòng. $T = \\frac{2\\pi}{\\omega}$.`, 
    'guide_mech-circular': `1. **Điều khiển:** Thay đổi **Bán kính ($r$)** và **Tốc độ góc ($\\omega$)**.
2. **Vector:**
    *   **Mũi tên Vàng:** Lực hướng tâm. Chú ý nó luôn vuông góc với vận tốc.
    *   **Mũi tên Đỏ:** Vận tốc dài (tiếp tuyến quỹ đạo).
3. **Thí nghiệm:** Giữ nguyên tốc độ góc, tăng bán kính lên gấp đôi. Lực hướng tâm sẽ tăng gấp đôi ($F \\sim r$).
4. **Thí nghiệm 2:** Giữ nguyên bán kính, tăng tốc độ góc gấp đôi. Lực hướng tâm tăng gấp 4 ($F \\sim \\omega^2$).`,

    'theory_mech-pendulum': `# Con Lắc Đơn
**1. Cấu Tạo:**
Gồm một vật nhỏ khối lượng $m$ treo ở đầu một sợi dây không dãn, khối lượng không đáng kể, chiều dài $l$.

**2. Động Lực Học:**
Lực kéo về là thành phần của trọng lực theo phương tiếp tuyến quỹ đạo:
$$ P_t = -mg \\sin\\alpha $$
Với góc nhỏ ($\\alpha < 10^\\circ$), $\\sin\\alpha \\approx \\alpha \\approx s/l$, dao động trở thành điều hòa.

**3. Công Thức Chu Kỳ:**
Chu kỳ dao động nhỏ của con lắc đơn:
$$ T = 2\\pi \\sqrt{\\frac{l}{g}} $$
*   Nhận xét: Chu kỳ **không phụ thuộc** vào khối lượng $m$ của vật nặng.

**4. Năng Lượng:**
Cơ năng được bảo toàn (bỏ qua ma sát):
$$ W = W_đ + W_t = \\frac{1}{2}mv^2 + mgl(1-\\cos\\alpha) = \\text{hằng số} $$`, 
    'guide_mech-pendulum': `1. **Bắt đầu:** Dùng chuột kéo quả nặng lệch khỏi vị trí cân bằng một góc nhỏ rồi thả tay.
2. **Kiểm chứng:** Thay đổi **Khối lượng**. Bạn sẽ thấy chu kỳ $T$ không đổi.
3. **Chiều dài:** Tăng chiều dài dây $l$. Chu kỳ sẽ tăng chậm ($T \\sim \\sqrt{l}$).
4. **Tắt dần:** Thêm **Độ tắt dần (Damping)**. Cơ năng sẽ giảm dần theo thời gian do ma sát, biên độ góc giảm dần về 0.`,

    'theory_mech-spring': `# Con Lắc Lò Xo
**1. Định Luật Hooke:**
Trong giới hạn đàn hồi, lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng.
$$ F_{\\text{đh}} = -k x $$
*   $k$: Độ cứng lò xo (N/m).
*   $x$: Độ dời so với vị trí lò xo không biến dạng.

**2. Dao Động Điều Hòa:**
Phương trình động lực học:
$$ m x'' + k x = 0 $$
Tần số góc riêng: $\\omega = \\sqrt{\\frac{k}{m}}$.

**3. Chu Kỳ ($T$):**
$$ T = 2\\pi \\sqrt{\\frac{m}{k}} $$

**4. Năng Lượng:**
$$ W = \\frac{1}{2} k A^2 $$
Cơ năng tỉ lệ với bình phương biên độ.`, 
    'guide_mech-spring': `1. **Tương tác:** Kéo vật nặng xuống dưới để tạo biên độ ban đầu, sau đó thả ra.
2. **Đồ thị:** Quan sát đồ thị **Vị trí - Thời gian**. Đó là một đường hình sin.
3. **Độ cứng:** Tăng $k$ (lò xo cứng hơn) $\\rightarrow$ Dao động nhanh hơn (Chu kỳ giảm).
4. **Khối lượng:** Tăng $m$ (vật nặng hơn) $\\rightarrow$ Dao động chậm lại (Chu kỳ tăng).`,

    'theory_mech-torque': `# Cân Bằng Vật Rắn (Mô-men)
**1. Khái Niệm Mô-men Lực:**
Mô-men lực đặc trưng cho tác dụng làm quay của lực quanh một trục.
$$ M = F \\cdot d $$
*   $F$: Độ lớn lực tác dụng (N).
*   $d$: Cánh tay đòn (khoảng cách từ trục quay đến giá của lực).

**2. Quy Tắc Mô-men (Điều kiện cân bằng):**
Muốn cho một vật có trục quay cố định ở trạng thái cân bằng thì tổng các mô-men lực làm vật quay theo chiều kim đồng hồ phải bằng tổng các mô-men lực làm vật quay ngược chiều kim đồng hồ.
$$ \\sum M_{\\text{xuôi}} = \\sum M_{\\text{ngược}} $$
Trong trường hợp đòn bẩy đơn giản:
$$ P_1 \\cdot d_1 = P_2 \\cdot d_2 $$`, 
    'guide_mech-torque': `1. **Thử thách:** Treo một vật 5kg ở vị trí số 4 bên trái. Mô-men trái = $5 \\times 4 = 20$.
2. **Tính toán:** Để cân bằng, bạn cần tạo ra Mô-men phải = 20.
    *   Cách 1: Treo vật 5kg ở vị trí 4.
    *   Cách 2: Treo vật 10kg ở vị trí 2 ($10 \\times 2 = 20$).
    *   Cách 3: Treo vật 4kg ở vị trí 5 ($4 \\times 5 = 20$).
3. **Kiểm tra:** Đặt vật lên và xem thanh đòn có nằm ngang (trạng thái cân bằng) hay không.`,

    'theory_mech-collisions': `# Va Chạm Đàn Hồi Trực Diện
**1. Hệ Kín & Bảo Toàn Động Lượng:**
Nếu không có ngoại lực tác dụng lên hệ (hoặc ngoại lực triệt tiêu nhau), động lượng của hệ được bảo toàn.
$$ \\vec{p}_{\\text{hệ}} = \\vec{p}_1 + \\vec{p}_2 = \\text{const} $$
$$ m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2' $$

**2. Bảo Toàn Cơ Năng (Chỉ Va Chạm Đàn Hồi):**
Trong va chạm tuyệt đối đàn hồi, động năng toàn phần được bảo toàn.
$$ \\frac{1}{2}m_1 v_1^2 + \\frac{1}{2}m_2 v_2^2 = \\frac{1}{2}m_1 v_1'^2 + \\frac{1}{2}m_2 v_2'^2 $$

**3. Vận Tốc Sau Va Chạm:**
Giải hệ phương trình trên, ta được:
$$ v_1' = \\frac{(m_1 - m_2)v_1 + 2m_2 v_2}{m_1 + m_2} $$
$$ v_2' = \\frac{(m_2 - m_1)v_2 + 2m_1 v_1}{m_1 + m_2} $$`, 
    'guide_mech-collisions': `1. **Cài đặt:** Chọn khối lượng và vận tốc cho hai vật (Xanh và Đỏ).
2. **Dự đoán:**
    *   Nếu $m_1 = m_2$: Hai vật sẽ trao đổi vận tốc cho nhau.
    *   Nếu vật nhỏ va vào vật rất lớn đang đứng yên: Vật nhỏ bị bật ngược lại với vận tốc cũ, vật lớn gần như không đổi.
3. **Chạy:** Nhấn nút Play để kiểm chứng kết quả.
4. **Số liệu:** So sánh tổng Động Lượng (P) trước và sau va chạm.`,

    'theory_mech-fluid': `# Nguyên Lý Ác-si-mét
**1. Phát Biểu:**
Mọi vật nhúng trong chất lỏng đều bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng từ dưới lên. Độ lớn lực này bằng trọng lượng của phần chất lỏng bị vật chiếm chỗ.

**2. Công Thức:**
$$ F_A = P_{\\text{lỏng bị chiếm}} = \\rho_{\\text{lỏng}} \\cdot V_{\\text{chìm}} \\cdot g $$
*   $\\rho_{\\text{lỏng}}$: Khối lượng riêng chất lỏng ($kg/m^3$).
*   $V_{\\text{chìm}}$: Thể tích phần vật chìm trong chất lỏng ($m^3$).

**3. Điều Kiện Nổi:**
*   Vật nổi khi: $F_A > P_{\\text{vật}}$ (hoặc $\\rho_{\\text{lỏng}} > \\rho_{\\text{vật}}$). Khi cân bằng thì $F_A = P_{\\text{vật}}$.
*   Vật chìm khi: $F_A < P_{\\text{vật}}$ (hoặc $\\rho_{\\text{lỏng}} < \\rho_{\\text{vật}}$).

**4. Trọng Lượng Biểu Kiến:**
Khi cân vật trong nước, số chỉ lực kế giảm đi:
$$ P' = P - F_A $$`, 
    'guide_mech-fluid': `1. **Thí nghiệm:** Hạ từ từ vật vào bình nước tràn.
2. **Quan sát:**
    *   Nước dâng lên và chảy ra cốc đong (Thể tích nước tràn = Thể tích phần chìm).
    *   Lực kế giảm giá trị (xuất hiện lực nâng).
3. **Kiểm chứng:** Bạn sẽ thấy giá trị của **Lực Đẩy Ác-si-mét** (hiển thị trên màn hình) luôn bằng **Trọng lượng của lượng nước tràn ra**.
4. **Vật liệu:** Thử đổi vật liệu sang "Gỗ". Do gỗ nhẹ hơn nước, nó sẽ nổi lơ lửng và chỉ chìm một phần.`,

    'theory_mech-relativity': `# Thuyết Tương Đối Hẹp: Giãn Nở Thời Gian
**1. Tiên Đề Einstein:**
Tốc độ ánh sáng trong chân không ($c$) là hằng số đối với mọi hệ quy chiếu quán tính, bất kể nguồn sáng hay người quan sát chuyển động thế nào.

**2. Hệ Quả - Giãn Nở Thời Gian:**
Một đồng hồ chuyển động với vận tốc $v$ sẽ chạy chậm hơn so với một đồng hồ đứng yên. Hiện tượng này chỉ đáng kể khi $v$ tiệm cận $c$.

**3. Công Thức:**
$$ \\Delta t = \\frac{\\Delta t_0}{\\sqrt{1 - \\frac{v^2}{c^2}}} = \\gamma \\Delta t_0 $$
*   $\\Delta t_0$: Thời gian riêng (đo bởi người trên tàu).
*   $\\Delta t$: Thời gian đo bởi người quan sát đứng yên (Trái Đất).
*   $\\gamma$: Hệ số Lorentz. Vì $v < c$ nên $\\gamma \\ge 1$, suy ra $\\Delta t \\ge \\Delta t_0$.

**4. Nghịch Lý Anh Em Sinh Đôi:**
Người em ở lại Trái Đất sẽ già đi nhanh hơn người anh đi du hành vũ trụ với tốc độ cao trở về.`, 
    'guide_mech-relativity': `1. **Đồng Hồ Ánh Sáng:** Quan sát đường đi của hạt photon trên tàu.
    *   Đối với người trên tàu: Photon đi lên rồi xuống (đường thẳng đứng).
    *   Đối với người Trái Đất: Do tàu đang bay, photon phải đi theo đường **Zíc-Zắc** (quãng đường dài hơn).
2. **Vận tốc:** Kéo thanh trượt để tăng vận tốc tàu lên 80%, 90% rồi 99% tốc độ ánh sáng.
3. **Kết quả:** Ở 99% c, hệ số $\\gamma \\approx 7$. Nghĩa là 1 giây trên tàu bằng 7 giây trôi qua ở Trái Đất.`,

    'theory_elec-coulomb': `# Định Luật Coulomb
**1. Nội Dung:**
Lực tương tác tĩnh điện giữa hai điện tích điểm đặt trong chân không tỉ lệ thuận với tích độ lớn của hai điện tích và tỉ lệ nghịch với bình phương khoảng cách giữa chúng.

**2. Công Thức:**
$$ F = k \\frac{|q_1 q_2|}{r^2} $$
*   $k = 9 \\cdot 10^9 \\, (N \\cdot m^2 / C^2)$: Hằng số Coulomb.
*   $q_1, q_2$: Độ lớn hai điện tích (Coulomb, C).
*   $r$: Khoảng cách giữa hai điện tích (m).

**3. Đặc Điểm Lực:**
*   Phương: Nằm trên đường thẳng nối hai điện tích.
*   Chiều:
    *   Đẩy nhau nếu cùng dấu ($q_1 q_2 > 0$).
    *   Hút nhau nếu trái dấu ($q_1 q_2 < 0$).`, 
    'guide_elec-coulomb': `1. **Khoảng cách:** Kéo hai điện tích lại gần nhau. Quan sát lực tương tác tăng vọt rất nhanh (do tỉ lệ nghịch với $r^2$).
2. **Độ lớn:** Tăng giá trị điện tích $q_1$. Lực tác dụng lên cả 2 điện tích đều tăng (theo định luật III Newton, $F_{12} = F_{21}$).
3. **Đảo dấu:** Đổi $q_2$ thành số âm. Hai điện tích sẽ hút nhau (Vector lực hướng vào trong).`,

    'theory_elec-field': `# Điện Trường
**1. Khái Niệm:**
Điện trường là môi trường vật chất đặc biệt bao quanh các điện tích, tác dụng lực điện lên các điện tích khác đặt trong nó.

**2. Cường Độ Điện Trường ($\vec{E}$):**
Là đại lượng đặc trưng cho tác dụng lực của điện trường tại một điểm.
$$ \\vec{E} = \\frac{\\vec{F}}{q} $$
Đơn vị: Vôn trên mét (V/m).

**3. Nguyên Lý Chồng Chất:**
Điện trường tại một điểm do nhiều điện tích gây ra bằng tổng vector các điện trường thành phần.
$$ \\vec{E}_{\\text{tổng}} = \\vec{E}_1 + \\vec{E}_2 + \\dots $$

**4. Đường Sức Điện:**
*   Xuất phát từ điện tích Dương (+), kết thúc ở điện tích Âm (-).
*   Không cắt nhau.
*   Nơi nào đường sức dày thì điện trường mạnh.`, 
    'guide_elec-field': `1. **Thiết lập:** Đặt một điện tích Dương (+) và một điện tích Âm (-) để tạo thành hệ lưỡng cực. Quan sát các đường cong nối từ (+) sang (-).
2. **Cảm biến:** Bật chế độ "Sensor Mode". Di chuyển chuột quanh không gian. Mũi tên màu vàng cho biết hướng và độ lớn của lực điện tác dụng lên một điện tích thử dương tại điểm đó.
3. **Triệt tiêu:** Đặt hai điện tích dương gần nhau. Tìm điểm ở giữa mà tại đó Sensor chỉ giá trị 0 (Điểm cân bằng).`,

    'theory_elec-ohm': `# Định Luật Ohm cho Đoạn Mạch
**1. Nội Dung:**
Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây.

**2. Công Thức:**
$$ I = \\frac{U}{R} $$
*   $I$: Cường độ dòng điện (Ampe, A).
*   $U$: Hiệu điện thế (Vôn, V).
*   $R$: Điện trở (Ohm, $\\Omega$).

**3. Công Suất Điện:**
$$ P = U \\cdot I = I^2 R = \\frac{U^2}{R} $$
Đơn vị: Oát (W). Công suất đặc trưng cho tốc độ tiêu thụ điện năng.

**4. Định Luật Kirchhoff (Mở rộng):**
*   **Nút (KCL):** Tổng dòng vào = Tổng dòng ra.
*   **Vòng (KVL):** Tổng hiệu điện thế trong một vòng kín bằng 0.`, 
    'guide_elec-ohm': `1. **Lắp mạch:** Kéo một Pin và một Điện trở ra bảng mạch. Dùng Dây dẫn nối chúng lại thành một vòng kín.
2. **Đo đạc:**
    *   Chọn **Vôn kế**, kéo 2 đầu dò vào 2 đầu điện trở để đo $U$.
    *   Chọn **Ampe kế**, rê chuột vào dây dẫn để đo dòng điện $I$.
3. **Kiểm chứng:** Tính tỉ số $U/I$, kết quả sẽ bằng giá trị $R$ của điện trở.
4. **Quá tải:** Nếu nối tắt 2 đầu pin mà không có điện trở (Đoản mạch), dòng điện sẽ tăng vô hạn và gây cháy nổ (Cảnh báo đỏ).`,

    'theory_elec-ac': `# Mạch Điện Xoay Chiều RLC Nối Tiếp
**1. Dòng Điện Xoay Chiều:**
Cường độ biến thiên điều hòa: $i = I_0 \\cos(\\omega t + \\varphi_i)$.

**2. Các Phần Tử:**
*   **Điện trở R:** $u, i$ cùng pha.
*   **Cuộn cảm L:** $u$ sớm pha $\\pi/2$ so với $i$. Cảm kháng $Z_L = \\omega L$.
*   **Tụ điện C:** $u$ trễ pha $\\pi/2$ so với $i$. Dung kháng $Z_C = \\frac{1}{\\omega C}$.

**3. Tổng Trở ($Z$):**
$$ Z = \\sqrt{R^2 + (Z_L - Z_C)^2} $$
Định luật Ohm cho mạch AC: $I = \\frac{U}{Z}$.

**4. Độ Lệch Pha ($\\varphi$):**
Độ lệch pha của $u$ so với $i$:
$$ \\tan \\varphi = \\frac{Z_L - Z_C}{R} $$`, 
    'guide_elec-ac': `1. **Quan sát:** Bên trái là mạch điện mô phỏng, bên phải là **Giản đồ vector quay (Phasor)** và đồ thị sóng.
2. **Thay đổi tần số:** Kéo thanh trượt tần số $f$.
    *   Khi $f$ tăng $\\rightarrow$ $Z_L$ tăng, $Z_C$ giảm $\\rightarrow$ Mạch có tính cảm kháng ($U$ sớm pha hơn $I$).
    *   Khi $f$ giảm $\\rightarrow$ $Z_C$ tăng $\\rightarrow$ Mạch có tính dung kháng ($U$ trễ pha hơn $I$).
3. **Cộng hưởng:** Điều chỉnh $f$ sao cho $Z_L = Z_C$. Khi đó vector $V$ và $I$ trùng nhau (cùng pha), dòng điện $I$ đạt cực đại.`,

    'theory_opt-refraction': `# Khúc Xạ Ánh Sáng
**1. Hiện Tượng:**
Là hiện tượng chùm tia sáng bị đổi phương đột ngột (gãy khúc) khi đi qua mặt phân cách giữa hai môi trường truyền sáng khác nhau.

**2. Chiết Suất ($n$):**
Đại lượng đặc trưng cho khả năng bẻ gãy tia sáng của môi trường.
$$ n = \\frac{c}{v} $$
($c$: tốc độ ánh sáng chân không, $v$: tốc độ trong môi trường).

**3. Định Luật Snell (Định luật Khúc xạ):**
$$ n_1 \\sin i = n_2 \\sin r $$
*   $i$: Góc tới.
*   $r$: Góc khúc xạ.
*   Nếu $n_2 > n_1$ (môi trường chiết quang hơn) $\\rightarrow r < i$ (tia sáng gãy lại gần pháp tuyến).

**4. Phản Xạ Toàn Phần:**
Xảy ra khi ánh sáng đi từ môi trường chiết quang hơn sang kém hơn ($n_1 > n_2$) và góc tới $i \\ge i_{\\text{gh}}$.
$$ \\sin i_{\\text{gh}} = \\frac{n_2}{n_1} $$`, 
    'guide_opt-refraction': `1. **Thao tác:** Kéo tay cầm của đèn Laser để thay đổi góc chiếu.
2. **Khúc xạ:** Đặt môi trường trên là Không khí ($n=1$), dưới là Nước ($n=1.33$). Bạn sẽ thấy tia sáng đi vào nước bị gập xuống (lại gần pháp tuyến).
3. **Phản xạ toàn phần:** Đảo ngược lại: Trên là Thủy tinh ($n=1.5$), dưới là Không khí. Tăng góc tới từ từ. Đến một góc nào đó (khoảng $42^\\circ$), tia khúc xạ biến mất hoàn toàn, toàn bộ ánh sáng bị phản xạ ngược lại.`,

    'theory_opt-prism': `# Tán Sắc Ánh Sáng
**1. Định Nghĩa:**
Là sự phân tách một chùm ánh sáng phức tạp thành các chùm sáng đơn sắc riêng biệt. Nguyên nhân là do chiết suất của môi trường trong suốt phụ thuộc vào tần số (màu sắc) của ánh sáng.

**2. Đặc Điểm:**
*   Ánh sáng Đỏ có bước sóng lớn nhất $\\rightarrow$ Chiết suất nhỏ nhất $\\rightarrow$ Lệch ít nhất.
*   Ánh sáng Tím có bước sóng nhỏ nhất $\\rightarrow$ Chiết suất lớn nhất $\\rightarrow$ Lệch nhiều nhất.
$$ D_{\\text{đỏ}} < D_{\\text{cam}} < \\dots < D_{\\text{tím}} $$

**3. Công Thức Lăng Kính (Góc chiết quang A nhỏ):**
Góc lệch $D = (n-1)A$. Vì $n$ khác nhau nên $D$ khác nhau, tạo thành dải màu.`, 
    'guide_opt-prism': `1. **Thiết lập:** Nhấn nút **TỰ ĐỘNG CĂN CHỈNH** để máy tính sắp xếp góc chiếu tối ưu.
2. **Quan sát:** Chùm sáng trắng đi qua lăng kính bị xòe ra thành 7 màu cầu vồng trên màn chắn.
3. **Vật liệu:** Thử đổi vật liệu sang "Kim Cương". Chiết suất kim cương rất lớn ($n=2.42$) và độ tán sắc mạnh, nên dải quang phổ sẽ rộng và rực rỡ hơn thủy tinh thường.`,

    'theory_opt-lenses': `# Thấu Kính Mỏng
**1. Phân Loại:**
*   **Thấu kính Hội tụ (Rìa mỏng):** Biến chùm tới song song thành chùm tia hội tụ tại tiêu điểm $F'$. ($f > 0$).
*   **Thấu kính Phân kì (Rìa dày):** Biến chùm tới song song thành chùm tia phân kì từ tiêu điểm ảnh ảo $F'$. ($f < 0$).

**2. Công Thức Thấu Kính:**
$$ \\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d'} $$
*   $d$: Khoảng cách từ vật đến thấu kính.
*   $d'$: Khoảng cách từ ảnh đến thấu kính. ($d' > 0$: Ảnh thật, $d' < 0$: Ảnh ảo).

**3. Độ Phóng Đại ($k$):**
$$ k = -\\frac{d'}{d} = \\frac{A'B'}{AB} $$`, 
    'guide_opt-lenses': `1. **Di chuyển:** Kéo vật sáng (mũi tên đỏ) lại gần hoặc ra xa thấu kính.
2. **Ảnh thật:** Khi vật ở ngoài tiêu cự ($d > f$), bạn sẽ thấy ảnh thật (mũi tên vàng) ngược chiều bên kia thấu kính.
3. **Kính lúp:** Kéo vật vào trong tiêu cự ($d < f$). Ảnh thật biến mất, thay vào đó là **Ảnh ảo** cùng chiều và lớn hơn vật nằm cùng phía. Đây là nguyên lý của kính lúp.`,

    'theory_opt-interference': `# Giao Thoa Ánh Sáng (Khe Young)
**1. Điều Kiện Giao Thoa:**
Hai nguồn sáng phải là hai nguồn kết hợp (cùng tần số và hiệu số pha không đổi theo thời gian).

**2. Hiệu Đường Đi:**
Hiệu đường đi từ hai khe $S_1, S_2$ đến điểm $M$ trên màn:
$$ d_2 - d_1 = \\frac{ax}{D} $$
($a$: khoảng cách 2 khe, $D$: khoảng cách đến màn, $x$: tọa độ vân).

**3. Vị Trí Vân:**
*   **Vân Sáng (Cực đại):** $d_2 - d_1 = k\\lambda \\Rightarrow x_s = k \\frac{\\lambda D}{a}$
*   **Vân Tối (Cực tiểu):** $d_2 - d_1 = (k + 0.5)\\lambda \\Rightarrow x_t = (k + 0.5) \\frac{\\lambda D}{a}$

**4. Khoảng Vân ($i$):**
Khoảng cách giữa hai vân sáng liên tiếp:
$$ i = \\frac{\\lambda D}{a} $$`, 
    'guide_opt-interference': `1. **Thông số:** Điều chỉnh **Khoảng cách 2 khe ($a$)**. Nếu $a$ càng nhỏ, khoảng vân $i$ càng lớn (dễ quan sát).
2. **Bước sóng:** Thay đổi màu sắc ánh sáng.
    *   Ánh sáng Đỏ ($\lambda$ lớn) $\\rightarrow$ Vân giao thoa rộng, thưa.
    *   Ánh sáng Tím ($\lambda$ nhỏ) $\\rightarrow$ Vân giao thoa hẹp, sít nhau.
3. **Hình ảnh:** Quan sát sự xen kẽ giữa các vệt sáng (tăng cường) và vệt tối (triệt tiêu) trên màn hứng.`,

    'theory_opt-photoelectric': `# Hiệu Ứng Quang Điện
**1. Định Nghĩa:**
Là hiện tượng electron bị bứt ra khỏi bề mặt kim loại khi có ánh sáng thích hợp chiếu vào nó.

**2. Định Luật Về Giới Hạn Quang Điện:**
Mỗi kim loại có một bước sóng giới hạn $\\lambda_0$. Hiện tượng chỉ xảy ra khi ánh sáng kích thích có bước sóng $\\lambda \\le \\lambda_0$.
$$ \\lambda_0 = \\frac{hc}{A} $$
($A$: Công thoát của electron).

**3. Hệ Thức Einstein:**
Năng lượng của photon ánh sáng tới được dùng để cung cấp công thoát và truyền động năng ban đầu cho electron.
$$ \\varepsilon = hf = A + W_{d0\\max} $$
$$ \\frac{hc}{\\lambda} = A + e U_{\\text{hãm}} $$`, 
    'guide_opt-photoelectric': `1. **Chọn kim loại:** Chọn "Kẽm" (Zinc). Kẽm có công thoát lớn, ánh sáng nhìn thấy không đủ năng lượng để gây ra hiện tượng.
2. **Bước sóng:** Kéo thanh trượt về phía vùng Tử ngoại (UV, bước sóng ngắn). Khi năng lượng photon đủ lớn ($hf > A$), các hạt electron (chấm vàng) sẽ bị bắn ra.
3. **Hiệu điện thế hãm:** Kéo thanh Voltage về phía âm. Khi điện trường cản trở đủ lớn, các electron sẽ bị đẩy lùi và không sang được cực đối diện (Dòng điện bằng 0).`,

    'theory_therm-gas': `# Phương Trình Trạng Thái Khí Lý Tưởng
**1. Khí Lý Tưởng:**
Mô hình khí trong đó các phân tử được coi là chất điểm, chỉ tương tác khi va chạm và va chạm là hoàn toàn đàn hồi.

**2. Phương Trình Clapeyron-Mendeleev:**
$$ pV = nRT $$
*   $p$: Áp suất (Pa hoặc atm).
*   $V$: Thể tích ($m^3$ hoặc lít).
*   $n$: Số mol khí.
*   $R$: Hằng số khí lý tưởng ($8.31 J/mol.K$).
*   $T$: Nhiệt độ tuyệt đối (Kelvin, $K = ^oC + 273$).

**3. Các Đẳng Quá Trình:**
*   **Đẳng nhiệt (T = const):** $p_1 V_1 = p_2 V_2$ (Định luật Boyle).
*   **Đẳng tích (V = const):** $p_1/T_1 = p_2/T_2$ (Định luật Charles).
*   **Đẳng áp (p = const):** $V_1/T_1 = V_2/T_2$ (Định luật Gay-Lussac).`, 
    'guide_therm-gas': `1. **Nung nóng:** Tăng nhiệt độ $T$. Các hạt khí chuyển động nhanh hơn (động năng tăng), va chạm vào thành bình mạnh hơn $\\rightarrow$ Áp suất tăng.
2. **Nén khí:** Giảm thể tích $V$. Mật độ hạt tăng lên, số lần va chạm vào thành bình tăng $\\rightarrow$ Áp suất tăng.
3. **Bơm khí:** Tăng số lượng hạt $n$. Nhiều hạt hơn thì áp suất cao hơn.`,

    'theory_therm-calorimetry': `# Cân Bằng Nhiệt & Nhiệt Lượng
**1. Nhiệt Lượng ($Q$):**
Là phần năng lượng nhiệt được truyền từ vật này sang vật khác.
$$ Q = m c \\Delta T = m c (t_2 - t_1) $$
*   $m$: Khối lượng (kg).
*   $c$: Nhiệt dung riêng (J/kg.K) - đặc trưng cho chất liệu.
*   $\\Delta T$: Độ biến thiên nhiệt độ.

**2. Phương Trình Cân Bằng Nhiệt:**
Khi các vật trong hệ cô lập trao đổi nhiệt với nhau:
$$ \\sum Q_{\\text{tỏa}} = \\sum Q_{\\text{thu}} $$
Nhiệt lượng tỏa ra bằng nhiệt lượng thu vào. Nhiệt độ cuối cùng của các vật là bằng nhau ($t_{\\text{cb}}$).

**3. Ý Nghĩa:**
Vật có nhiệt dung riêng $c$ lớn (như nước) thì khó nóng lên và cũng lâu nguội đi hơn so với vật có $c$ nhỏ (như kim loại).`, 
    'guide_therm-calorimetry': `1. **Chuẩn bị:** Cốc nước ở $20^\\circ C$ và khối kim loại nóng ở $100^\\circ C$.
2. **Thả vật:** Nhấn nút thả vật. Nhiệt sẽ truyền từ khối kim loại sang nước.
3. **Đồ thị:** Theo dõi đường biểu diễn nhiệt độ. Đường màu cam (Kim loại) đi xuống, đường màu xanh (Nước) đi lên. Chúng sẽ gặp nhau tại một đường ngang - đó là **Nhiệt độ cân bằng**.`,

    'theory_therm-carnot': `# Chu Trình Carnot & Động Cơ Nhiệt
**1. Động Cơ Nhiệt:**
Thiết bị biến đổi Nhiệt năng thành Cơ năng. Nó nhận nhiệt $Q_1$ từ nguồn nóng, sinh công $A$ và tỏa nhiệt thừa $Q_2$ cho nguồn lạnh.

**2. Hiệu Suất ($H$):**
$$ H = \\frac{A}{Q_1} = \\frac{Q_1 - Q_2}{Q_1} = 1 - \\frac{Q_2}{Q_1} $$

**3. Định Lý Carnot:**
Hiệu suất của động cơ nhiệt lí tưởng (chu trình Carnot) chỉ phụ thuộc vào nhiệt độ của nguồn nóng ($T_1$) và nguồn lạnh ($T_2$). Đây là hiệu suất lớn nhất có thể đạt được.
$$ H_{\\max} = 1 - \\frac{T_2}{T_1} $$
(Lưu ý: $T$ phải tính theo độ Kelvin).

**4. Chu Trình Carnot (4 giai đoạn):**
1.  Giãn nở đẳng nhiệt (Nhận nhiệt).
2.  Giãn nở đoạn nhiệt (Sinh công, nhiệt độ giảm).
3.  Nén đẳng nhiệt (Tỏa nhiệt).
4.  Nén đoạn nhiệt (Nhận công, nhiệt độ tăng).`, 
    'guide_therm-carnot': `1. **Vận hành:** Nhấn BẮT ĐẦU để piston chuyển động.
2. **Biểu đồ P-V:** Theo dõi chấm vàng di chuyển tạo thành một vòng khép kín. Diện tích phần bên trong vòng kín chính là **Công cơ học** mà động cơ sinh ra trong 1 chu trình.
3. **Màu sắc:**
    *   Vùng đỏ: Đang nhận nhiệt từ nguồn nóng (Giãn đẳng nhiệt).
    *   Vùng xanh: Đang tỏa nhiệt ra nguồn lạnh (Nén đẳng nhiệt).`,
  }
};

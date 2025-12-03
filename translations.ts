
export type Language = 'en' | 'vi';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // --- UI ---
    'search_placeholder': 'Search experiments...',
    'created_by': 'Created by',
    'author_name': 'PHUC DO',
    'theory_guide': 'Notebook',
    'theory': 'Theory',
    'guide': 'Guide',
    'physics_concepts': 'Physics Concepts',
    'theory_subtitle': 'Understanding the fundamental principles',
    'interactive_guide': 'Interactive Guide',
    'guide_subtitle': 'Step-by-step simulation instructions',
    'pro_tip': 'Pro Tip',
    'pro_tip_content': 'Isolate variables! Change only one parameter at a time to see its specific effect on the system.',
    
    // --- CONTROLS & LABELS ---
    'control_center': 'Control Center',
    'measurements': 'Measurements',
    'reset': 'Reset',
    'velocity': 'Velocity', 'angle': 'Angle', 'height': 'Height', 'gravity': 'Gravity', 'drag': 'Drag',
    'mass': 'Mass', 'friction': 'Friction', 'thrust': 'Thrust', 'tension': 'Tension',
    'time': 'Time', 'range': 'Range', 'period': 'Period', 'frequency': 'Frequency',
    'length': 'Length', 'stiffness': 'Stiffness', 'damping': 'Damping', 'position': 'Position',
    'pressure': 'Pressure', 'temp': 'Temperature', 'volume': 'Volume', 'particles': 'Particles',
    'stop': 'Stop', 'fire': 'Fire', 'pause': 'Pause', 'simulate': 'Simulate', 'start': 'Start',
    'slow_motion': 'Slow Motion', 'real_time': 'Real Time',
    
    // --- SPECIFIC ---
    'acceleration': 'Acceleration',
    'dynamics_controls': 'Dynamics Controls',
    'flight_data': 'Flight Data', 'target_mode': 'Target Mode', 'target_hit': 'TARGET HIT',
    'oscillation_data': 'Oscillation Data', 'equilibrium_line': 'Equilibrium Line', 'graph_pos_time': 'Position vs Time',
    'orbit_radius': 'Orbit Radius', 'angular_vel': 'Angular Velocity', 'vel_tangent': 'Tangent Velocity', 'centripetal_force': 'Centripetal Force',
    'torque': 'Torque', 'equilibrium': 'Equilibrium',
    'momentum': 'Momentum', 'kinetic': 'Kinetic Energy',
    'arch_physics_data': 'Physics Data', 'arch_weight': 'Weight', 'arch_buoyancy': 'Buoyancy', 'arch_scale': 'Scale Reading', 'arch_lower': 'Lower Object', 'arch_material': 'Material', 'arch_liquid': 'Liquid', 'arch_reset_pos': 'Reset Position', 'floating': 'FLOATING', 'displaced': 'Displaced',
    'earth_clock': 'Earth Clock', 'ship_clock': 'Ship Clock', 'time_dilation': 'Time Dilation', 'lorentz_factor': 'Lorentz Factor',
    'electrostatic_force': 'Electrostatic Force', 'drag_charges': 'Drag charges to adjust', 'proton': 'Proton', 'electron': 'Electron', 'sensor_mode': 'Sensor Mode', 'reset_charges': 'Reset Charges',
    'kirchhoff_analysis': 'Kirchhoff Analysis', 'total_source_v': 'Total Source V', 'total_drop_v': 'Total Drop V', 'power_gen': 'Power Gen', 'power_cons': 'Power Cons', 'voltage': 'Voltage', 'current': 'Current', 'resistance': 'Resistance', 'power': 'Power', 'voltage_drop': 'Voltage Drop', 'short_circuit': 'SHORT CIRCUIT', 'short_circuit_desc': 'Infinite current detected!', 'burnt': 'BURNT', 'open': 'Open', 'overload': 'OVERLOAD', 'select_comp_hint': 'Select a component to edit', 'quick_tutorial': 'Quick Tutorial', 'overheating_warning': 'Overheating Warning!',
    'series_rlc': 'SERIES RLC CIRCUIT', 'phasor': 'PHASOR', 'phase': 'Phase', 'inductance': 'Inductance', 'capacitance': 'Capacitance',
    'medium_1': 'Medium 1', 'medium_2': 'Medium 2', 'total_internal_reflection': 'TOTAL INTERNAL REFLECTION', 'wavefronts': 'Wavefronts', 'protractor': 'Protractor', 'drag_laser': 'Drag Laser',
    'auto_align_screen': 'AUTO ALIGN TO SCREEN', 'light_y_pos': 'Light Y Position', 'light_beam_angle': 'Light Beam Angle', 'prism_rotation': 'Prism Rotation',
    'virtual_image': 'Virtual Image', 'real_image': 'Real Image', 'focal_length': 'Focal Length', 'object_dist': 'Object Dist',
    'crest': 'Crest', 'trough': 'Trough', 'node': 'Node', 'wavelength': 'Wavelength', 'separation': 'Separation',
    'target_metal': 'Target Metal', 'photon_energy': 'Photon Energy', 'max_ke': 'Max KE', 'no_emission': 'NO EMISSION', 'stopping_voltage': 'Stopping Voltage', 'intensity': 'Intensity',
    'gas_properties': 'Gas Properties',
    'water_mass': 'Water Mass', 'water_temp': 'Water Temp', 'block_mass': 'Block Mass', 'block_temp': 'Block Temp', 'temp_plot': 'Temperature Plot', 'reset_lab': 'RESET LAB', 'drop_block': 'DROP BLOCK', 'water_label': 'Water', 'temp_axis': 'Temp (°C)', 'time_axis': 'Time', 'equilibrium_temp': 'Eq',
    'heat_in': 'Heat In', 'heat_out': 'Heat Out', 'insulated': 'Insulated', 'iso_exp': 'Isothermal Expansion', 'adia_exp': 'Adiabatic Expansion', 'iso_comp': 'Isothermal Compression', 'adia_comp': 'Adiabatic Compression', 'start_engine': 'START ENGINE', 'pause_engine': 'PAUSE ENGINE', 'sim_speed': 'Simulation Speed',
    
    // --- TOOLS ---
    'tool_cursor': 'Cursor', 'tool_battery': 'Battery', 'tool_wire': 'Wire', 'tool_resistor': 'Resistor', 'tool_bulb': 'Bulb', 'tool_switch': 'Switch', 'tool_voltmeter': 'Voltmeter', 'tool_ammeter': 'Ammeter', 'tool_ohmmeter': 'Ohmmeter', 'tutorial_step1': 'Select Battery', 'tutorial_step2': 'Place Battery', 'tutorial_step3': 'Select Wire', 'tutorial_step4': 'Connect', 'tutorial_step5': 'Add Load', 'tutorial_complete': 'Complete!',

    // --- TITLES ---
    'mech-motion-1d': 'Uniform Acceleration', 'desc_mech-motion-1d': 'Study 1D motion with constant acceleration, velocity, and position graphs.',
    'mech-projectile': 'Projectile Motion', 'desc_mech-projectile': 'Simulate parabolic trajectories under gravity.',
    'mech-newton': 'Newton\'s Laws', 'desc_mech-newton': 'Explore Force, Mass, and Acceleration.',
    'mech-circular': 'Circular Motion', 'desc_mech-circular': 'Centripetal force and angular velocity.',
    'mech-pendulum': 'Simple Pendulum', 'desc_mech-pendulum': 'Harmonic motion, period, and frequency.',
    'mech-spring': 'Spring Oscillator', 'desc_mech-spring': 'Hooke\'s Law and damping.',
    'mech-torque': 'Torque & Rotation', 'desc_mech-torque': 'Balance forces on a lever.',
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

    // --- DETAILED NOTEBOOK CONTENT ---
    'theory_mech-motion-1d': `# Uniformly Accelerated Linear Motion
**1. Definition**
Motion in a straight line where the instantaneous acceleration remains constant in magnitude and direction.

**2. Key Equations**
*   **Velocity:** $$ v = v_0 + at $$
*   **Position:** $$ x = x_0 + v_0 t + \\frac{1}{2}at^2 $$
*   **Velocity-Displacement:** $$ v^2 - v_0^2 = 2a(x - x_0) $$

**3. Variables**
*   $x$: Final Position (m)
*   $v$: Final Velocity (m/s)
*   $a$: Acceleration ($m/s^2$)
*   $t$: Time (s)`,
    'guide_mech-motion-1d': `1. **Parameters:** Set Initial Position, Velocity, and Acceleration.
2. **Start:** Press Play. The camera follows the train automatically.
3. **Graphs:** Observe the 3 real-time graphs on the right HUD.`,

    'theory_mech-projectile': `# Projectile Motion
**1. Definition**
Motion of an object projected into the air, subject only to the acceleration of gravity ($g$).

**2. Key Equations**
*   **Max Range ($R$):**
$$ R = \\frac{v_0^2 \\sin(2\\theta)}{g} $$
*   **Max Height ($H$):**
$$ H = \\frac{v_0^2 \\sin^2\\theta}{2g} $$
*   **Time of Flight ($T$):**
$$ T = \\frac{2v_0 \\sin\\theta}{g} $$`,
    'guide_mech-projectile': `1. Set **Velocity** and **Angle**.
2. Press **FIRE**.
3. Use **Target Mode** to practice hitting targets.`,

    'theory_mech-newton': `# Newton's Second Law
**1. Definition**
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

**2. Formula**
$$ \\vec{F}_{\\text{net}} = m \\cdot \\vec{a} $$

**3. Variables**
*   $\\vec{F}_{\\text{net}}$: Net Force (N)
*   $m$: Mass (kg)
*   $\\vec{a}$: Acceleration ($m/s^2$)`, 
    'guide_mech-newton': `1. Increase **Thrust** to accelerate.
2. Add **Friction** to oppose motion.
3. Observe how **Mass** affects acceleration (Inertia).`,

    'theory_mech-circular': `# Uniform Circular Motion
**1. Definition**
Motion in a circle at a constant speed. The velocity vector changes direction continuously.

**2. Key Formulas**
*   **Centripetal Force:**
$$ F_c = \\frac{mv^2}{r} = m \\omega^2 r $$
*   **Angular Velocity:**
$$ \\omega = \\frac{v}{r} = \\frac{2\\pi}{T} $$`, 
    'guide_mech-circular': `1. Adjust **Radius** and **Speed**.
2. Observe the **Centripetal Force** vector (Yellow) pointing to center.
3. Observe **Velocity** vector (Red) tangent to path.`,

    'theory_mech-pendulum': `# Simple Pendulum
**1. Definition**
A mass suspended from a fixed point that swings back and forth under the influence of gravity.

**2. Period Formula**
$$ T = 2\\pi\\sqrt{\\frac{L}{g}} $$

**3. Variables**
*   $T$: Period (s)
*   $L$: Length (m)
*   $g$: Gravity ($m/s^2$)`, 
    'guide_mech-pendulum': `1. Drag the bob to an angle and release.
2. Change **Length** to see period change.
3. Add **Damping** to simulate air resistance.`,

    'theory_mech-spring': `# Hooke's Law & SHM
**1. Hooke's Law**
The force needed to extend a spring is proportional to the distance.
$$ F = -kx $$

**2. Period of Oscillation**
$$ T = 2\\pi \\sqrt{\\frac{m}{k}} $$

**3. Variables**
*   $k$: Spring Constant (N/m)
*   $x$: Displacement (m)`, 
    'guide_mech-spring': `1. Drag mass down to start oscillation.
2. Adjust **Stiffness (k)** and **Mass (m)**.
3. Analyze the **Position vs Time** graph.`,

    'theory_mech-torque': `# Torque & Equilibrium
**1. Definition**
Torque is the rotational equivalent of linear force.

**2. Formulas**
*   **Torque:** $$ \\tau = F \\cdot d \\cdot \\sin\\theta $$
*   **Equilibrium Condition:**
$$ \\sum \\tau_{\\text{cw}} = \\sum \\tau_{\\text{ccw}} $$`, 
    'guide_mech-torque': `1. Place weights on the beam.
2. Balance the **Left Torque** and **Right Torque**.
3. Use formula $m_1 d_1 = m_2 d_2$.`,

    'theory_mech-collisions': `# Conservation of Momentum
**1. Principle**
In a closed system (no external forces), total momentum is conserved.

**2. Formula**
$$ m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}_1' + m_2 \\vec{v}_2' $$

**3. Types**
*   **Elastic:** Kinetic Energy is also conserved.
*   **Inelastic:** Kinetic Energy is lost to heat/sound.`, 
    'guide_mech-collisions': `1. Set **Mass** and **Velocity** for both objects.
2. Press **Simulate**.
3. Observe momentum transfer.`,

    'theory_mech-fluid': `# Archimedes' Principle
**1. Definition**
The buoyant force on a submerged object is equal to the weight of the fluid it displaces.

**2. Formula**
$$ F_b = \\rho_{\\text{fluid}} \\cdot V_{\\text{disp}} \\cdot g $$

**3. Variables**
*   $\\rho$: Fluid Density ($kg/m^3$)
*   $V$: Displaced Volume ($m^3$)`, 
    'guide_mech-fluid': `1. Lower the block into fluid.
2. Measure **Buoyancy** ($F_b$).
3. Compare with weight of displaced fluid.`,

    'theory_mech-relativity': `# Time Dilation
**1. Concept**
Time passes slower for an object moving at high speeds relative to a stationary observer.

**2. Formula**
$$ \\Delta t = \\frac{\\Delta t_0}{\\sqrt{1 - \\frac{v^2}{c^2}}} = \\gamma \\Delta t_0 $$

**3. Lorentz Factor**
$$ \\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}} $$`, 
    'guide_mech-relativity': `1. Increase velocity close to $c$.
2. Compare **Ship Clock** vs **Earth Clock**.
3. Watch the photon path lengthen.`,

    'theory_elec-coulomb': `# Coulomb's Law
**1. Definition**
The electrostatic force between two point charges is proportional to the product of charges and inversely proportional to distance squared.

**2. Formula**
$$ F = k \\frac{|q_1 q_2|}{r^2} $$
*   $k \\approx 9 \\times 10^9 N\\cdot m^2/C^2$`, 
    'guide_elec-coulomb': `1. Drag charges to change distance $r$.
2. Change charge magnitude $q$.
3. Observe attraction/repulsion.`,

    'theory_elec-field': `# Electric Field
**1. Definition**
A region around a charged particle where a force would be exerted on other charges.

**2. Intensity**
$$ \\vec{E} = \\frac{\\vec{F}}{q} $$

**3. Superposition**
$$ \\vec{E}_{\\text{tot}} = \\sum \\vec{E}_i $$`, 
    'guide_elec-field': `1. Place (+) and (-) charges.
2. Visualize Field Lines.
3. Use **Sensor** to measure field strength.`,

    'theory_elec-ohm': `# Ohm's Law
**1. Definition**
Current through a conductor between two points is directly proportional to the voltage across the two points.

**2. Formulas**
*   **Ohm's Law:** $$ I = \\frac{V}{R} $$
*   **Power:** $$ P = V \\cdot I $$`, 
    'guide_elec-ohm': `1. Build a circuit with Battery and Resistor.
2. Measure with **Voltmeter** and **Ammeter**.
3. Verify $V = IR$.`,

    'theory_elec-ac': `# AC RLC Circuits
**1. Impedance (Z)**
The total opposition to current flow in an AC circuit.
$$ Z = \\sqrt{R^2 + (X_L - X_C)^2} $$

**2. Reactance**
*   Inductive: $$ X_L = 2\\pi f L $$
*   Capacitive: $$ X_C = \\frac{1}{2\\pi f C} $$`, 
    'guide_elec-ac': `1. Adjust Frequency $f$.
2. Observe phase difference between V and I.
3. Find resonance (Voltage and Current in phase).`,

    'theory_opt-refraction': `# Refraction (Snell's Law)
**1. Definition**
The bending of light as it passes from one medium to another.

**2. Snell's Law**
$$ n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 $$

**3. Refractive Index**
$$ n = \\frac{c}{v} $$`, 
    'guide_opt-refraction': `1. Drag the **Laser** to change angle.
2. Change **Materials** ($n_1, n_2$).
3. Observe **Total Internal Reflection** when going from dense to rare medium.`,

    'theory_opt-prism': `# Dispersion
**1. Definition**
The separation of white light into its constituent colors due to wavelength-dependent refractive index.

**2. Cauchy's Equation**
$$ n(\\lambda) = A + \\frac{B}{\\lambda^2} $$
Shorter wavelengths (Blue) bend more than longer ones (Red).`, 
    'guide_opt-prism': `1. Shine white light on prism.
2. Rotate prism to see **Spectrum**.
3. Blue bends more than Red.`,

    'theory_opt-lenses': `# Thin Lens Equation
**1. Formula**
$$ \\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i} $$

**2. Magnification**
$$ m = -\\frac{d_i}{d_o} $$

**3. Sign Convention**
*   $f > 0$: Convex Lens
*   $f < 0$: Concave Lens`, 
    'guide_opt-lenses': `1. Move the Object ($d_o$).
2. Change Focal Length ($f$).
3. Check if image is Real or Virtual.`,

    'theory_opt-interference': `# Wave Interference
**1. Principle**
When two waves meet, their amplitudes add up (Superposition).

**2. Double Slit Conditions**
*   **Constructive (Bright):**
$$ \\Delta d = k\\lambda $$
*   **Destructive (Dark):**
$$ \\Delta d = (k+0.5)\\lambda $$`, 
    'guide_opt-interference': `1. Adjust slit separation.
2. Change Wavelength $\\lambda$.
3. Observe Interference Pattern.`,

    'theory_opt-photoelectric': `# Photoelectric Effect
**1. Definition**
Emission of electrons when electromagnetic radiation (light) hits a material.

**2. Einstein's Equation**
$$ K_{\\text{max}} = hf - \\Phi $$
*   $K_{\\text{max}}$: Max Kinetic Energy
*   $hf$: Photon Energy
*   $\\Phi$: Work Function`, 
    'guide_opt-photoelectric': `1. Change light **Color** (Frequency).
2. Find Threshold Frequency.
3. Use **Stopping Voltage** to measure KE.`,

    'theory_therm-gas': `# Ideal Gas Law
**1. Equation of State**
$$ pV = nRT $$

**2. Variables**
*   $p$: Pressure (Pa)
*   $V$: Volume ($m^3$)
*   $n$: Moles
*   $R$: Gas Constant
*   $T$: Temperature (K)`, 
    'guide_therm-gas': `1. Heat the gas ($T$).
2. Compress volume ($V$).
3. Observe Pressure ($p$) rise.`,

    'theory_therm-calorimetry': `# Heat Transfer
**1. Principle**
Heat flows from hot to cold until thermal equilibrium is reached.

**2. Specific Heat Formula**
$$ Q = mc\\Delta T $$

**3. Equilibrium**
$$ Q_{\\text{gained}} + Q_{\\text{lost}} = 0 $$`, 
    'guide_therm-calorimetry': `1. Set masses and initial temps.
2. Drop hot block into cold water.
3. Find Equilibrium Temperature.`,

    'theory_therm-carnot': `# Carnot Cycle
**1. Definition**
A theoretical thermodynamic cycle proposed by Nicolas Léonard Sadi Carnot. It provides the upper limit on the efficiency of any thermodynamic engine.

**2. Efficiency**
$$ \\eta = 1 - \\frac{T_{\\text{cold}}}{T_{\\text{hot}}} $$`, 
    'guide_therm-carnot': `1. Run the engine.
2. Watch the P-V Diagram.
3. Observe 4 stages: Isothermal/Adiabatic Exp/Comp.`,
  },

  vi: {
    // --- UI ---
    'search_placeholder': 'Tìm kiếm thí nghiệm...',
    'created_by': 'Thiết kế bởi',
    'author_name': 'PHÚC ĐỖ',
    'theory_guide': 'Sổ Tay Vật Lý',
    'theory': 'Lý Thuyết',
    'guide': 'Hướng Dẫn',
    'physics_concepts': 'Khái Niệm Vật Lý',
    'theory_subtitle': 'Hiểu rõ các nguyên lý cơ bản',
    'interactive_guide': 'Hướng Dẫn Tương Tác',
    'guide_subtitle': 'Các bước mô phỏng chi tiết',
    'pro_tip': 'Mẹo Hay',
    'pro_tip_content': 'Hãy thay đổi từng thông số một! Điều này giúp bạn quan sát rõ tác động của nó lên hệ thống.',
    
    // --- LABELS ---
    'control_center': 'Bảng Điều Khiển',
    'measurements': 'Đo Đạc',
    'reset': 'Đặt lại',
    'velocity': 'Vận tốc', 'angle': 'Góc', 'height': 'Độ cao', 'gravity': 'Trọng trường', 'drag': 'Lực cản',
    'mass': 'Khối lượng', 'friction': 'Ma sát', 'thrust': 'Lực đẩy', 'tension': 'Lực căng',
    'time': 'Thời gian', 'range': 'Tầm xa', 'period': 'Chu kỳ', 'frequency': 'Tần số',
    'length': 'Chiều dài', 'stiffness': 'Độ cứng', 'damping': 'Độ tắt dần', 'position': 'Vị trí',
    'pressure': 'Áp Suất', 'temp': 'Nhiệt Độ', 'volume': 'Thể Tích', 'particles': 'Số Hạt',
    'stop': 'Dừng', 'fire': 'Bắn', 'pause': 'Tạm dừng', 'simulate': 'Mô phỏng', 'start': 'Bắt đầu',
    'slow_motion': 'Quay Chậm', 'real_time': 'Thực Tế',
    
    // --- SPECIFIC ---
    'acceleration': 'Gia tốc',
    'dynamics_controls': 'Điều Khiển Động Lực Học',
    'flight_data': 'Dữ Liệu Bay', 'target_mode': 'Chế độ Bia', 'target_hit': 'TRÚNG MỤC TIÊU', 'target_distance': 'Khoảng Cách Bia', 'drag_to_move': 'Kéo để di chuyển',
    'oscillation_data': 'Số Liệu Dao Động', 'equilibrium_line': 'Vị trí cân bằng', 'graph_pos_time': 'Đồ thị Tọa độ', 'drag_to_start': 'Kéo để bắt đầu',
    'orbit_radius': 'Bán Kính', 'angular_vel': 'Tốc Độ Góc', 'vel_tangent': 'Vận Tốc', 'centripetal_force': 'Lực Hướng Tâm',
    'torque': 'Mô-men', 'equilibrium': 'Cân Bằng',
    'momentum': 'Động Lượng', 'kinetic': 'Động Năng',
    'arch_physics_data': 'Số Liệu Vật Lý', 'arch_weight': 'Trọng Lượng', 'arch_buoyancy': 'Lực Đẩy', 'arch_scale': 'Lực Kế', 'arch_lower': 'Hạ Vật', 'arch_material': 'Chất Liệu', 'arch_liquid': 'Chất Lỏng', 'arch_reset_pos': 'Kéo Lên', 'floating': 'NỔI', 'displaced': 'Tràn Ra',
    'earth_clock': 'Đồng Hồ Trái Đất', 'ship_clock': 'Đồng Hồ Tàu', 'time_dilation': 'Giãn Nở Thời Gian', 'lorentz_factor': 'Hệ số Lorentz',
    'electrostatic_force': 'Lực Tĩnh Điện', 'drag_charges': 'Kéo điện tích để chỉnh', 'proton': 'Proton', 'electron': 'Electron', 'sensor_mode': 'Chế độ Cảm Biến', 'reset_charges': 'Xóa Điện Tích',
    'kirchhoff_analysis': 'Phân Tích Kirchhoff', 'total_source_v': 'Tổng Nguồn', 'total_drop_v': 'Tổng Sụt Áp', 'power_gen': 'Công Suất Nguồn', 'power_cons': 'Công Suất Tiêu Thụ', 'voltage': 'Hiệu Điện Thế', 'current': 'Cường Độ Dòng', 'resistance': 'Điện Trở', 'power': 'Công Suất', 'voltage_drop': 'Sụt Áp', 'short_circuit': 'ĐOẢN MẠCH', 'short_circuit_desc': 'Dòng điện vô hạn!', 'burnt': 'CHÁY', 'open': 'Mở', 'overload': 'QUÁ TẢI', 'select_comp_hint': 'Chọn linh kiện để sửa', 'quick_tutorial': 'Hướng Dẫn Nhanh', 'overheating_warning': 'Cảnh Báo Quá Nhiệt!',
    'series_rlc': 'MẠCH RLC NỐI TIẾP', 'phasor': 'GIẢN ĐỒ VECTƠ', 'phase': 'Pha', 'inductance': 'Độ Tự Cảm', 'capacitance': 'Điện Dung',
    'medium_1': 'Môi Trường 1', 'medium_2': 'Môi Trường 2', 'total_internal_reflection': 'PHẢN XẠ TOÀN PHẦN', 'wavefronts': 'Mặt Sóng', 'protractor': 'Thước Đo Độ', 'drag_laser': 'Kéo đèn Laser', 'refractive_index': 'Chiết Suất (n)',
    'auto_align_screen': 'TỰ ĐỘNG CĂN CHỈNH', 'light_y_pos': 'Độ Cao Đèn', 'light_beam_angle': 'Góc Chiếu', 'prism_rotation': 'Xoay Lăng Kính',
    'virtual_image': 'Ảnh Ảo', 'real_image': 'Ảnh Thật', 'focal_length': 'Tiêu Cự', 'object_dist': 'Khoảng Cách Vật',
    'crest': 'Đỉnh Sóng', 'trough': 'Đáy Sóng', 'node': 'Nút Sóng', 'wavelength': 'Bước Sóng', 'separation': 'Khoảng Cách',
    'target_metal': 'Kim Loại', 'photon_energy': 'Năng Lượng Photon', 'max_ke': 'Động Năng Max', 'no_emission': 'KHÔNG PHÁT XẠ', 'stopping_voltage': 'Hiệu Điện Thế Hãm', 'intensity': 'Cường Độ',
    'gas_properties': 'Thông Số Khí',
    'water_mass': 'KL Nước', 'water_temp': 'Nhiệt Độ Nước', 'block_mass': 'KL Vật', 'block_temp': 'Nhiệt Độ Vật', 'temp_plot': 'Đồ Thị Nhiệt Độ', 'reset_lab': 'LÀM LẠI', 'drop_block': 'THẢ VẬT', 'water_label': 'Nước', 'temp_axis': 'Nhiệt Độ', 'time_axis': 'Thời Gian', 'equilibrium_temp': 'CB',
    'heat_in': 'Nhiệt Vào', 'heat_out': 'Nhiệt Ra', 'insulated': 'Cách Nhiệt', 'iso_exp': 'Giãn Đẳng Nhiệt', 'adia_exp': 'Giãn Đoạn Nhiệt', 'iso_comp': 'Nén Đẳng Nhiệt', 'adia_comp': 'Nén Đoạn Nhiệt', 'start_engine': 'CHẠY ĐỘNG CƠ', 'pause_engine': 'DỪNG ĐỘNG CƠ', 'sim_speed': 'Tốc Độ',

    // --- TITLES ---
    'mech-motion-1d': 'Chuyển Động Biến Đổi Đều', 'desc_mech-motion-1d': 'Khảo sát chuyển động thẳng với gia tốc không đổi và đồ thị tọa độ.',
    'mech-projectile': 'Chuyển Động Ném Xiên', 'desc_mech-projectile': 'Mô phỏng quỹ đạo ném xiên.',
    'mech-newton': 'Định Luật Newton', 'desc_mech-newton': 'Lực, Khối lượng và Gia tốc.',
    'mech-circular': 'Chuyển Động Tròn', 'desc_mech-circular': 'Lực hướng tâm và chuyển động tròn.',
    'mech-pendulum': 'Con Lắc Đơn', 'desc_mech-pendulum': 'Dao động điều hòa của con lắc.',
    'mech-spring': 'Con Lắc Lò Xo', 'desc_mech-spring': 'Định luật Hooke và dao động.',
    'mech-torque': 'Cân Bằng Vật Rắn & Mô-men', 'desc_mech-torque': 'Cân bằng lực trên đòn bẩy.',
    'mech-collisions': 'Va Chạm Đàn Hồi', 'desc_mech-collisions': 'Bảo toàn động lượng.',
    'mech-fluid': 'Nguyên Lý Ác-si-mét', 'desc_mech-fluid': 'Lực đẩy Ác-si-mét và sự nổi.',
    'mech-relativity': 'Thuyết Tương Đối Hẹp', 'desc_mech-relativity': 'Giãn nở thời gian.',
    'elec-coulomb': 'Định Luật Coulomb', 'desc_elec-coulomb': 'Lực tương tác điện tích.',
    'elec-field': 'Điện Trường', 'desc_elec-field': 'Đường sức điện trường.',
    'elec-ohm': 'Mạch Định Luật Ohm', 'desc_elec-ohm': 'Mạch điện một chiều DC.',
    'elec-ac': 'Mạch Điện Xoay Chiều RLC', 'desc_elec-ac': 'Dòng điện xoay chiều AC.',
    'opt-refraction': 'Khúc Xạ & Định Luật Snell', 'desc_opt-refraction': 'Sự khúc xạ ánh sáng.',
    'opt-prism': 'Tán Sắc Lăng Kính', 'desc_opt-prism': 'Quang phổ ánh sáng trắng.',
    'opt-lenses': 'Thấu Kính Mỏng & Quang Hình', 'desc_opt-lenses': 'Tạo ảnh qua thấu kính.',
    'opt-interference': 'Giao Thoa Sóng', 'desc_opt-interference': 'Giao thoa khe Young.',
    'opt-photoelectric': 'Hiệu Ứng Quang Điện', 'desc_opt-photoelectric': 'Tính chất hạt của ánh sáng.',
    'therm-gas': 'Phương Trình Khí Lý Tưởng', 'desc_therm-gas': 'Áp suất, Thể tích, Nhiệt độ.',
    'therm-calorimetry': 'Nhiệt Lượng Kế', 'desc_therm-calorimetry': 'Cân bằng nhiệt.',
    'therm-carnot': 'Động Cơ Nhiệt', 'desc_therm-carnot': 'Chu trình Carnot.',
    'Mechanics': 'Cơ Học', 'Electricity': 'Điện Học', 'Optics': 'Quang Học', 'Thermodynamics': 'Nhiệt Học',

    // --- TOOLS ---
    'tool_cursor': 'Chuột', 'tool_battery': 'Pin', 'tool_wire': 'Dây', 'tool_resistor': 'Điện Trở', 'tool_bulb': 'Đèn', 'tool_switch': 'Công Tắc', 'tool_voltmeter': 'Vôn Kế', 'tool_ammeter': 'Ampe Kế', 'tool_ohmmeter': 'Ohm Kế', 'tutorial_step1': 'Chọn Pin', 'tutorial_step2': 'Đặt Pin', 'tutorial_step3': 'Chọn Dây', 'tutorial_step4': 'Nối Dây', 'tutorial_step5': 'Thêm Đèn/Trở', 'tutorial_complete': 'Hoàn Thành!',

    // --- NOTEBOOK CONTENT (VI) ---
    'theory_mech-motion-1d': `# Chuyển Động Thẳng Biến Đổi Đều
**1. Định Nghĩa**
Chuyển động thẳng trong đó gia tốc tức thời không đổi theo thời gian (cả về độ lớn và hướng).

**2. Các Phương Trình Chuyển Động**
*   **Vận tốc:** $$ v = v_0 + at $$
*   **Tọa độ:** $$ x = x_0 + v_0 t + \\frac{1}{2}at^2 $$
*   **Hệ thức độc lập thời gian:** $$ v^2 - v_0^2 = 2a(x - x_0) $$

**3. Đặc Điểm Đồ Thị**
*   **Đồ thị $a-t$:** Đường thẳng song song trục thời gian.
*   **Đồ thị $v-t$:** Đường thẳng xiên góc, hệ số góc bằng $a$.
*   **Đồ thị $x-t$:** Một phần của đường Parabol.`,
    'guide_mech-motion-1d': `1. **Cài đặt:** Chọn Tọa độ đầu ($x_0$), Vận tốc đầu ($v_0$) và Gia tốc ($a$).
2. **Chạy:** Nhấn nút Bắt Đầu. Camera sẽ tự động trượt theo tàu.
3. **Đồ thị:** Quan sát 3 đồ thị thời gian thực ở góc phải.`,

    'theory_mech-projectile': `# Chuyển Động Ném Xiên
**1. Định nghĩa**
Chuyển động của một vật được ném lên với vận tốc ban đầu hợp với phương ngang một góc $\\alpha$, chỉ chịu tác dụng của trọng lực.

**2. Các Công Thức Chính**
*   **Tầm xa cực đại ($L$):**
$$ L = \\frac{v_0^2 \\sin(2\\alpha)}{g} $$
*   **Độ cao cực đại ($H$):**
$$ H = \\frac{v_0^2 \\sin^2\\alpha}{2g} $$
*   **Thời gian bay ($t$):**
$$ t = \\frac{2v_0 \\sin\\alpha}{g} $$`,
    'guide_mech-projectile': `1. Chỉnh **Vận tốc** và **Góc**.
2. Nhấn **BẮN**.
3. Dùng **Chế độ Bia** để luyện tập.
4. Chỉnh **Trọng trường** ($g$) để thử nghiệm.`,

    'theory_mech-newton': `# Định Luật II Newton
**1. Định nghĩa**
Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật.

**2. Công Thức**
$$ \\vec{F}_{\\text{net}} = m \\cdot \\vec{a} $$`, 
    'guide_mech-newton': `1. Tăng **Lực đẩy** để tăng tốc.
2. Thêm **Ma sát** để cản chuyển động.
3. Quan sát quán tính khi thay đổi **Khối lượng**.`,

    'theory_mech-circular': `# Chuyển Động Tròn Đều
**1. Định nghĩa**
Chuyển động có quỹ đạo tròn và tốc độ không đổi. Vận tốc biến đổi liên tục về hướng.

**2. Công Thức**
*   **Lực Hướng Tâm ($F_{\\text{ht}}$):**
$$ F_{\\text{ht}} = \\frac{mv^2}{r} = m \\omega^2 r $$
*   **Tốc độ góc ($\\omega$):**
$$ \\omega = \\frac{v}{r} = \\frac{2\\pi}{T} $$`, 
    'guide_mech-circular': `1. Chỉnh **Bán kính** và **Tốc độ**.
2. Vector Vàng: Lực Hướng Tâm.
3. Vector Đỏ: Vận tốc dài.`,

    'theory_mech-pendulum': `# Con Lắc Đơn
**1. Định nghĩa**
Một vật nhỏ khối lượng m treo ở đầu một sợi dây không dãn, khối lượng không đáng kể, dài l.

**2. Chu Kỳ Dao Động**
$$ T = 2\\pi \\sqrt{\\frac{l}{g}} $$`, 
    'guide_mech-pendulum': `1. Kéo vật lệch khỏi VTCB rồi thả.
2. Tăng **Chiều dài** ($l$) -> Chu kỳ tăng.
3. Thêm **Độ tắt dần** để dừng dao động.`,

    'theory_mech-spring': `# Con Lắc Lò Xo
**1. Định Luật Hooke**
Trong giới hạn đàn hồi, lực đàn hồi tỉ lệ thuận với độ biến dạng.
$$ F_{\\text{đh}} = -k \\Delta l $$

**2. Chu Kỳ**
$$ T = 2\\pi \\sqrt{\\frac{m}{k}} $$`, 
    'guide_mech-spring': `1. Kéo vật xuống để kích thích.
2. Tăng **Độ cứng (k)** -> Dao động nhanh hơn.
3. Xem đồ thị hình sin.`,

    'theory_mech-torque': `# Cân Bằng Vật Rắn
**1. Định nghĩa**
Mô-men lực đặc trưng cho tác dụng làm quay của lực.

**2. Công Thức**
$$ M = F \\cdot d \\cdot \\sin\\theta $$

**3. Điều Kiện Cân Bằng**
$$ \\sum M_{\\text{xuôi}} = \\sum M_{\\text{ngược}} $$`, 
    'guide_mech-torque': `1. Đặt quả nặng lên thanh đòn.
2. Tính toán để cân bằng 2 bên.
3. Kiểm tra trạng thái cân bằng.`,

    'theory_mech-collisions': `# Bảo Toàn Động Lượng
**1. Định nghĩa**
Trong một hệ kín (cô lập), tổng động lượng của hệ được bảo toàn.

**2. Công Thức**
$$ m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}_1' + m_2 \\vec{v}_2' $$`, 
    'guide_mech-collisions': `1. Chỉnh khối lượng và vận tốc.
2. Nhấn **Mô phỏng** để va chạm.
3. So sánh động lượng trước và sau.`,

    'theory_mech-fluid': `# Nguyên Lý Ác-si-mét
**1. Định nghĩa**
Một vật nhúng trong chất lỏng bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng lên trên, có độ lớn bằng trọng lượng của phần chất lỏng bị vật chiếm chỗ.

**2. Công Thức**
$$ F_A = \\rho \\cdot V \\cdot g $$`, 
    'guide_mech-fluid': `1. Hạ vật vào trong nước.
2. Đo **Lực Đẩy**.
3. Xem nước tràn ra.`,

    'theory_mech-relativity': `# Giãn Nở Thời Gian
**1. Định nghĩa**
Thời gian trôi đi chậm hơn đối với một quan sát viên đang chuyển động với tốc độ cao so với một quan sát viên đứng yên.

**2. Công Thức**
$$ \\Delta t = \\frac{\\Delta t_0}{\\sqrt{1 - v^2/c^2}} = \\gamma \\Delta t_0 $$`, 
    'guide_mech-relativity': `1. Tăng vận tốc tàu vũ trụ.
2. So sánh 2 đồng hồ.
3. Xem đường đi của ánh sáng.`,

    'theory_elec-coulomb': `# Định Luật Coulomb
**1. Định nghĩa**
Lực tương tác giữa hai điện tích điểm tỉ lệ thuận với tích độ lớn của hai điện tích và tỉ lệ nghịch với bình phương khoảng cách giữa chúng.

**2. Công Thức**
$$ F = k \\frac{|q_1 q_2|}{r^2} $$`, 
    'guide_elec-coulomb': `1. Thay đổi khoảng cách $r$.
2. Thay đổi điện tích $q$.
3. Quan sát lực hút/đẩy.`,

    'theory_elec-field': `# Điện Trường
**1. Định nghĩa**
Môi trường vật chất bao quanh điện tích và truyền tương tác điện.

**2. Công Thức**
$$ \\vec{E} = \\frac{\\vec{F}}{q} $$`, 
    'guide_elec-field': `1. Đặt điện tích vào không gian.
2. Xem đường sức điện.
3. Dùng **Cảm biến** đo cường độ.`,

    'theory_elec-ohm': `# Định Luật Ohm
**1. Định nghĩa**
Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây.

**2. Công Thức**
$$ I = \\frac{U}{R} $$`, 
    'guide_elec-ohm': `1. Lắp mạch Pin, Dây, Đèn.
2. Dùng Vôn kế đo $U$.
3. Dùng Ampe kế đo $I$.`,

    'theory_elec-ac': `# Dòng Điện Xoay Chiều
**1. Tổng Trở ($Z$)**
$$ Z = \\sqrt{R^2 + (Z_L - Z_C)^2} $$

**2. Độ Lệch Pha ($\\varphi$)**
$$ \\tan \\varphi = \\frac{Z_L - Z_C}{R} $$`, 
    'guide_elec-ac': `1. Chỉnh tần số $f$.
2. Quan sát độ lệch pha $U, I$.
3. Tìm cộng hưởng điện.`,

    'theory_opt-refraction': `# Khúc Xạ Ánh Sáng
**1. Định nghĩa**
Hiện tượng chùm sáng bị gãy khúc khi đi qua mặt phân cách giữa hai môi trường trong suốt khác nhau.

**2. Định Luật Snell**
$$ n_1 \\sin i = n_2 \\sin r $$`, 
    'guide_opt-refraction': `1. Kéo đèn Laser chỉnh góc tới.
2. Thay đổi môi trường ($n$).
3. Tìm góc phản xạ toàn phần.`,

    'theory_opt-prism': `# Tán Sắc Ánh Sáng
**1. Định nghĩa**
Sự phân tách một chùm ánh sáng phức tạp thành các chùm sáng đơn sắc.

**2. Nguyên Nhân**
Chiết suất của lăng kính phụ thuộc vào bước sóng ánh sáng.`, 
    'guide_opt-prism': `1. Chiếu đèn vào lăng kính.
2. Xoay lăng kính.
3. Quan sát cầu vồng.`,

    'theory_opt-lenses': `# Thấu Kính Mỏng
**1. Công Thức Thấu Kính**
$$ \\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d'} $$

**2. Độ Phóng Đại**
$$ k = -\\frac{d'}{d} $$`, 
    'guide_opt-lenses': `1. Di chuyển vật sáng.
2. Thay đổi tiêu cự $f$.
3. Xem ảnh thật hay ảo.`,

    'theory_opt-interference': `# Giao Thoa Sóng
**1. Định nghĩa**
Sự tổng hợp của hai hay nhiều sóng kết hợp trong không gian.

**2. Điều Kiện Cực Đại**
$$ d_2 - d_1 = k \\lambda $$`, 
    'guide_opt-interference': `1. Chỉnh khoảng cách nguồn.
2. Thay đổi bước sóng.
3. Xem vân giao thoa.`,

    'theory_opt-photoelectric': `# Hiệu Ứng Quang Điện
**1. Định nghĩa**
Hiện tượng electron bị bứt ra khỏi bề mặt kim loại khi có ánh sáng thích hợp chiếu vào.

**2. Hệ Thức Einstein**
$$ \\varepsilon = hf = A + W_{d0\\max} $$`, 
    'guide_opt-photoelectric': `1. Đổi màu ánh sáng (bước sóng).
2. Tìm giới hạn quang điện.
3. Đo hiệu điện thế hãm.`,

    'theory_therm-gas': `# Khí Lý Tưởng
**1. Thuyết Động Học**
Chất khí được cấu tạo từ các phân tử chuyển động hỗn loạn không ngừng.

**2. Phương Trình Trạng Thái**
$$ pV = nRT $$`, 
    'guide_therm-gas': `1. Nung nóng khí ($T$).
2. Nén thể tích ($V$).
3. Xem áp suất ($p$) tăng.`,

    'theory_therm-calorimetry': `# Cân Bằng Nhiệt
**1. Nguyên Lý**
Nhiệt tự truyền từ vật có nhiệt độ cao sang vật có nhiệt độ thấp.

**2. Phương Trình Cân Bằng**
$$ Q_{\\text{tỏa}} = Q_{\\text{thu}} $$`, 
    'guide_therm-calorimetry': `1. Chọn vật liệu và nhiệt độ.
2. Thả vào nước.
3. Tìm nhiệt độ cân bằng.`,

    'theory_therm-carnot': `# Chu Trình Carnot
**1. Định nghĩa**
Chu trình thuận nghịch lí tưởng có hiệu suất cao nhất.

**2. Hiệu Suất**
$$ H = 1 - \\frac{T_2}{T_1} $$`, 
    'guide_therm-carnot': `1. Chạy động cơ.
2. Xem đồ thị P-V.
3. Quan sát 4 giai đoạn.`,
  }
};

// ============================================
// VOLTAIC CELLS WEBSITE - JAVASCRIPT
// Smooth scroll + Nernst Simulator
// ============================================

// Toggle explanation visibility
function toggleExplain(btn) {
    const explanation = btn.nextElementSibling;
    const isHidden = explanation.classList.contains('hidden');
    
    if (isHidden) {
        explanation.classList.remove('hidden');
        btn.classList.add('active');
        btn.textContent = '✕ Hide';
    } else {
        explanation.classList.add('hidden');
        btn.classList.remove('active');
        btn.textContent = '💡 Explain';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Nernst Simulator
    const eStandard = document.getElementById('e-standard');
    const temperature = document.getElementById('temperature');
    const concProducts = document.getElementById('conc-products');
    const concReactants = document.getElementById('conc-reactants');
    const nElectrons = document.getElementById('n-electrons');
    
    const tempValue = document.getElementById('temp-value');
    const prodValue = document.getElementById('prod-value');
    const reactValue = document.getElementById('react-value');
    const cellPotential = document.getElementById('cell-potential');
    const qValue = document.getElementById('q-value');
    const tempFactor = document.getElementById('temp-factor');
    const qNote = document.getElementById('q-note');

    function calculateNernst() {
        const E0 = parseFloat(eStandard.value) || 1.10;
        const T = parseFloat(temperature.value) || 25;
        const Cprod = parseFloat(concProducts.value) || 1.0;
        const Creact = parseFloat(concReactants.value) || 1.0;
        const n = parseInt(nElectrons.value) || 2;

        // Update display values
        tempValue.textContent = T;
        prodValue.textContent = Cprod.toFixed(1);
        reactValue.textContent = Creact.toFixed(1);

        // Calculate Q (reaction quotient)
        const Q = Cprod / Creact;
        qValue.textContent = Q.toFixed(2);

        // Temperature-dependent factor: (RT/nF) * ln(10) ≈ 0.0591 * (T+273)/298
        const factor = 0.0591 * ((T + 273) / 298);
        tempFactor.textContent = factor.toFixed(4);

        // Nernst equation: E = E° - (factor/n) * log(Q)
        const logQ = Math.log10(Q);
        const E = E0 - (factor / n) * logQ;
        cellPotential.textContent = E.toFixed(3);

        // Show/hide note about Q=1
        if (Math.abs(Q - 1) < 0.01) {
            qNote.textContent = "⚠️ Q ≈ 1, so log(Q) ≈ 0 → Temperature has no effect!";
            qNote.style.color = '#FFD700';
        } else {
            qNote.textContent = `log(Q) = ${logQ.toFixed(3)} → Temperature affects E`;
            qNote.style.color = '#4ECDC4';
        }

        // Color feedback based on E vs E°
        if (E > E0 + 0.001) {
            cellPotential.style.color = '#4ECDC4'; // Higher than standard
        } else if (E < E0 - 0.001) {
            cellPotential.style.color = '#FF6B6B'; // Lower than standard
        } else {
            cellPotential.style.color = '#FFD700'; // Equal to standard
        }
    }

    // Add event listeners
    [eStandard, temperature, concProducts, concReactants, nElectrons].forEach(input => {
        if (input) {
            input.addEventListener('input', calculateNernst);
        }
    });

    // Initial calculation
    calculateNernst();

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(29, 53, 87, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#1D3557';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });
});


package com.shopsphere.config;

import com.shopsphere.entity.*;
import com.shopsphere.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log =
            LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${shopsphere.seed.admin.email:}")
    private String adminEmail;

    @Value("${shopsphere.seed.admin.password:}")
    private String adminPassword;

    @Value("${shopsphere.seed.admin.name:ShopSphere Administrator}")
    private String adminName;

    @Value("${shopsphere.seed.customer.email:}")
    private String customerEmail;

    @Value("${shopsphere.seed.customer.password:}")
    private String customerPassword;

    @Value("${shopsphere.seed.customer.name:Demo Customer}")
    private String customerName;

    public DataInitializer(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            CartRepository cartRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {

        log.info("Running ShopSphere DataInitializer...");

        seedUsers();
        seedCategoriesAndProducts();

        log.info("ShopSphere DataInitializer completed successfully.");
    }

    private void seedUsers() {

        // Seed Admin only when credentials are configured
        if (adminEmail != null && !adminEmail.isBlank()
                && adminPassword != null && !adminPassword.isBlank()) {

            if (userRepository.findByEmail(adminEmail).isEmpty()) {

                User admin = new User(
                        adminEmail,
                        passwordEncoder.encode(adminPassword),
                        adminName,
                        Role.ADMIN,
                        "+1-800-555-0199",
                        "100 Enterprise Way, Silicon Valley, CA 94025"
                );

                userRepository.save(admin);

                log.info("Admin account seeded: {}", adminEmail);
            }

        } else {
            log.warn(
                    "Admin account not seeded. Configure ADMIN_EMAIL and ADMIN_PASSWORD."
            );
        }

        // Seed Demo Customer only when credentials are configured
        if (customerEmail != null && !customerEmail.isBlank()
                && customerPassword != null && !customerPassword.isBlank()) {

            if (userRepository.findByEmail(customerEmail).isEmpty()) {

                User customer = new User(
                        customerEmail,
                        passwordEncoder.encode(customerPassword),
                        customerName,
                        Role.CUSTOMER,
                        "+1-555-234-5678",
                        "742 Evergreen Terrace, Springfield, OR 97477"
                );

                User savedCustomer = userRepository.save(customer);

                if (cartRepository.findByUserId(savedCustomer.getId()).isEmpty()) {
                    cartRepository.save(new Cart(savedCustomer));
                }

                log.info("Demo Customer account seeded: {}", customerEmail);
            }

        } else {
            log.info(
                    "Demo Customer not seeded. Configure customer credentials if required."
            );
        }
    }

    private void seedCategoriesAndProducts() {

        if (categoryRepository.count() > 0
                && productRepository.count() >= 12) {

            log.info(
                    "Categories and products already seeded. Skipping product seeding."
            );

            return;
        }

        // 1. Electronics
        Category electronics = categoryRepository.findBySlug("electronics")
                .orElseGet(() -> categoryRepository.save(new Category(
                        "Electronics",
                        "electronics",
                        "High-performance gadgets, productivity tools, and modern computing gear.",
                        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80"
                )));

        // 2. Audio & Wearables
        Category audio = categoryRepository.findBySlug("audio-wearables")
                .orElseGet(() -> categoryRepository.save(new Category(
                        "Audio & Wearables",
                        "audio-wearables",
                        "Studio-grade headphones, true wireless earbuds, and intelligent smartwatches.",
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                )));

        // 3. Fashion & Lifestyle
        Category fashion = categoryRepository.findBySlug("fashion-lifestyle")
                .orElseGet(() -> categoryRepository.save(new Category(
                        "Fashion & Lifestyle",
                        "fashion-lifestyle",
                        "Timeless urban aesthetics, versatile everyday apparel, and handcrafted accessories.",
                        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80"
                )));

        // 4. Home & Office
        Category homeOffice = categoryRepository.findBySlug("home-office")
                .orElseGet(() -> categoryRepository.save(new Category(
                        "Home & Office",
                        "home-office",
                        "Ergonomic desk setups, architectural lighting, and modern artisan living decor.",
                        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80"
                )));

        if (productRepository.count() == 0) {

            List<Product> products = List.of(

                    // Electronics
                    new Product(
                            "ProDesk Mechanical Keyboard",
                            "prodesk-mechanical-keyboard",
                            "Custom-tuned hot-swappable mechanical switches with south-facing RGB, CNC-milled aluminum chassis, and seamless tri-mode wireless connectivity.",
                            new BigDecimal("149.99"),
                            35,
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                            electronics,
                            true,
                            true
                    ),

                    new Product(
                            "Precision Wireless Ergonomic Mouse",
                            "precision-wireless-ergonomic-mouse",
                            "Sculpted for maximum wrist comfort with a 26K DPI optical sensor, hyper-fast magnetic scrolling, and up to 70 days battery life on USB-C.",
                            new BigDecimal("79.99"),
                            48,
                            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
                            electronics,
                            false,
                            true
                    ),

                    new Product(
                            "UltraWide 34-inch Curved Display",
                            "ultrawide-34-inch-curved-display",
                            "Immersive 1500R curvature WQHD panel with HDR400, 165Hz refresh rate, and 90W USB-C single cable docking for ultimate workflow clarity.",
                            new BigDecimal("549.99"),
                            14,
                            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
                            electronics,
                            true,
                            true
                    ),

                    new Product(
                            "Thunderbolt 4 Quad Hub & Dock",
                            "thunderbolt-4-quad-hub",
                            "Compact desktop powerhouse providing dual 4K video outputs, Gigabit Ethernet, SD 4.0 card reader, and 100W Power Delivery.",
                            new BigDecimal("189.50"),
                            22,
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
                            electronics,
                            false,
                            true
                    ),

                    // Audio & Wearables
                    new Product(
                            "Apex ANC Studio Headphones",
                            "apex-anc-studio-headphones",
                            "Hybrid active noise cancellation with beryllium 40mm drivers, memory foam lambskin cushions, and 45-hour ultra battery endurance.",
                            new BigDecimal("299.99"),
                            28,
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                            audio,
                            true,
                            true
                    ),

                    new Product(
                            "PulseFlow True Wireless Earbuds",
                            "pulseflow-true-wireless-earbuds",
                            "Spatial audio with dynamic head tracking, IPX7 water resistance, transparent ambient mode, and fast Qi wireless charging case.",
                            new BigDecimal("129.00"),
                            60,
                            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
                            audio,
                            true,
                            true
                    ),

                    new Product(
                            "Aero Titanium Smartwatch Pro",
                            "aero-titanium-smartwatch-pro",
                            "Aerospace titanium case with sapphire glass AMOLED touch display, ECG heart sensor, dual-frequency GPS, and 14-day battery reserve.",
                            new BigDecimal("249.95"),
                            19,
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                            audio,
                            true,
                            true
                    ),

                    new Product(
                            "EchoSonic 360 Portable Bluetooth Speaker",
                            "echosonic-360-portable-speaker",
                            "Omnidirectional room-filling acoustic performance with deep passive radiators, IP67 rugged build, and 20 hours play time.",
                            new BigDecimal("89.99"),
                            42,
                            "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
                            audio,
                            false,
                            true
                    ),

                    // Fashion & Lifestyle
                    new Product(
                            "Commuter Weatherproof Roll-Top Backpack",
                            "commuter-weatherproof-backpack",
                            "Built with ballistic Cordura fabric, magnetic Fidlock buckle, padded 16-inch laptop chamber, and hidden passport security pocket.",
                            new BigDecimal("119.00"),
                            30,
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                            fashion,
                            true,
                            true
                    ),

                    new Product(
                            "Minimalist Vegetable-Tanned Leather Wallet",
                            "minimalist-leather-wallet",
                            "Hand-stitched full grain Italian leather with RFID blocking aluminum core, holding up to 10 cards with quick card-fan ejection.",
                            new BigDecimal("49.99"),
                            75,
                            "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
                            fashion,
                            false,
                            true
                    ),

                    new Product(
                            "Classic Organic Cotton Heavyweight Hoodie",
                            "classic-organic-cotton-hoodie",
                            "450 GSM French terry combed cotton offering a comfortable relaxed fit, double-lined hood, and pre-shrunk garment-dyed finish.",
                            new BigDecimal("69.95"),
                            55,
                            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
                            fashion,
                            false,
                            true
                    ),

                    new Product(
                            "Aviator Polarized Titanium Sunglasses",
                            "aviator-polarized-titanium-sunglasses",
                            "Featherlight Japanese titanium frame with Carl Zeiss polarized anti-glare lenses and 100% UVA/UVB protection.",
                            new BigDecimal("135.00"),
                            24,
                            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
                            fashion,
                            false,
                            true
                    ),

                    // Home & Office
                    new Product(
                            "Lumina Balanced LED Architect Desk Lamp",
                            "lumina-balanced-desk-lamp",
                            "Color-tunable CRI 95+ flicker-free illumination with clamp base, ambient auto-dimming sensor, and wireless smartphone charger base.",
                            new BigDecimal("99.99"),
                            38,
                            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
                            homeOffice,
                            true,
                            true
                    ),

                    new Product(
                            "Solid Walnut Monitor Stand & Riser",
                            "solid-walnut-monitor-stand",
                            "Crafted from sustainable American walnut with integrated felt accessory shelf and brushed aluminum non-scratch feet.",
                            new BigDecimal("84.50"),
                            26,
                            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
                            homeOffice,
                            false,
                            true
                    )
            );

            productRepository.saveAll(products);

            log.info(
                    "Seeded {} default products across {} categories.",
                    products.size(),
                    categoryRepository.count()
            );
        }
    }
}

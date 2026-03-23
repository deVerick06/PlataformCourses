import { useNavigate } from "react-router-dom";
import styles from "./Plans.module.css";

function Plans() {
    const currentPlan = localStorage.getItem("plan_type")
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Free',
            price: 'Grátis',
            benefit: ['Acesso a curos básicos', 'Suporte da comunidade'],
            db_value: 'free'
        },
        {
            name: 'Premium',
            price: '27,90/mês',
            benefit: ['Acesso a TODOS os cursos', 'Suporte prioritário', 'Certificados'],
            db_value: 'premium'
        }
    ]

    async function handleUpgrade(plan_value) {
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:5000/users/upgrade_plan", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({plan_value: plan_value})
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return
        }

        if (response.ok) {
            localStorage.setItem("plan_type", plan_value);
            navigate("/home");
            return
        }
        console.log(currentPlan)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Escolha seu Plano</h1>
            <div className={styles.cardsWrapper}>
                {plans.map((plan) => (
                    <div key={plan.db_value} className={styles.card}>
                        <h3 className={styles.cardName}>{plan.name}</h3>
                        <div  className={styles.cardPrice}>
                            {plan.price}
                        </div>
                        <div className={styles.benefitsList}>
                            {plan.benefit.map((benefit_plan, index) => (
                                <p key={index} className={styles.benefitsItem} >
                                    <span style={{ color: '#007bff' }}>✓</span> {benefit_plan}
                                </p>
                            ))}
                        </div>
                        {currentPlan != plan.db_value ? (
                            <button className={styles.actionBtn} onClick={() => handleUpgrade(plan.db_value)}>
                                Assinar {plan.name}
                            </button>
                        ) : (
                            <button className={styles.disabledBtn} disabled>
                                Seu plano atual
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Plans
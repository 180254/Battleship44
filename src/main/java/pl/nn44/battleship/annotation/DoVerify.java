package pl.nn44.battleship.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.SOURCE)
@Target(value = {ElementType.METHOD, ElementType.CONSTRUCTOR})
public @interface DoVerify {
    /**
     * Indicates of verification is done:<br/>
     * - if true method/constructor may throw IllegalArgumentException<br/>
     * - if false method/constructor accept any param
     */
    boolean value();
}

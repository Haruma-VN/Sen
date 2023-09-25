using System.Xml;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule.Buffer;

namespace Sen.Shell.Modules.Support.PVZ.Particles
{
    public class Particles
    {
        public ParticlesEmitter[]? Emitters;
    }

    public class ParticlesEmitter
    {
        public string? Name; //<Name>
        public object? Image; //<Image>
        public string? ImagePath;
        public int? ImageCol;
        public int? ImageRow;
        public int? ImageFrames; //1
        public int? Animated;
        public int ParticleFlags = 0;
        public int? EmitterType; //1
        public string? OnDuration; //<OnDuration>
        public ParticlesTrackNode[]? SystemDuration; //<SystemDuration>
        public ParticlesTrackNode[]? CrossFadeDuration; //<CrossFadeDuration>
        public ParticlesTrackNode[]? SpawnRate; //<SpawnRate>
        public ParticlesTrackNode[]? SpawnMinActive; //<SpawnMinActive>
        public ParticlesTrackNode[]? SpawnMaxActive; //<SpawnMaxActive>
        public ParticlesTrackNode[]? SpawnMaxLaunched; //<SpawnMaxLaunched>
        public ParticlesTrackNode[]? EmitterRadius; //<EmitterRadius>
        public ParticlesTrackNode[]? EmitterOffsetX; //<EmitterOffsetX>
        public ParticlesTrackNode[]? EmitterOffsetY; //<EmitterOffsetY>
        public ParticlesTrackNode[]? EmitterBoxX; //<EmitterBoxX>
        public ParticlesTrackNode[]? EmitterBoxY; //<EmitterBoxY>
        public ParticlesTrackNode[]? EmitterPath; //<EmitterPath>
        public ParticlesTrackNode[]? EmitterSkewX; //<EmitterSkewX>
        public ParticlesTrackNode[]? EmitterSkewY; //<EmitterSkewY>
        public ParticlesTrackNode[]? ParticleDuration; //<ParticleDuration>
        public ParticlesTrackNode[]? SystemRed; //<SystemRed>
        public ParticlesTrackNode[]? SystemGreen; //<SystemGreen>
        public ParticlesTrackNode[]? SystemBlue; //<SystemBlue>
        public ParticlesTrackNode[]? SystemAlpha; //<SystemAlpha>
        public ParticlesTrackNode[]? SystemBrightness; //<SystemBrightness>
        public ParticlesTrackNode[]? LaunchSpeed; //<LaunchSpeed>
        public ParticlesTrackNode[]? LaunchAngle; //<LaunchAngle>
        public ParticlesField[]? Field; //<Field>
        public ParticlesField[]? SystemField; //<SystemField>
        public ParticlesTrackNode[]? ParticleRed; //<ParticleRed>
        public ParticlesTrackNode[]? ParticleGreen; //<ParticleGreen>
        public ParticlesTrackNode[]? ParticleBlue; //<ParticleBlue>
        public ParticlesTrackNode[]? ParticleAlpha; //<ParticleAlpha>
        public ParticlesTrackNode[]? ParticleBrightness; //<ParticleBrightness>
        public ParticlesTrackNode[]? ParticleSpinAngle; //<ParticleSpinAngle>
        public ParticlesTrackNode[]? ParticleSpinSpeed; //<ParticleSpinSpeed>
        public ParticlesTrackNode[]? ParticleScale; //<ParticleScale>
        public ParticlesTrackNode[]? ParticleStretch; //<ParticleStretch>
        public ParticlesTrackNode[]? CollisionReflect; //<CollisionReflect>
        public ParticlesTrackNode[]? CollisionSpin; //<CollisionSpin>
        public ParticlesTrackNode[]? ClipTop; //<ClipTop>
        public ParticlesTrackNode[]? ClipBottom; //<ClipBottom>
        public ParticlesTrackNode[]? ClipLeft; //<ClipLeft>
        public ParticlesTrackNode[]? ClipRight; //<ClipRight>
        public ParticlesTrackNode[]? AnimationRate; //<AnimationRate>
    }

    public class ParticlesField
    {
        public int? FieldType;
        public ParticlesTrackNode[]? X;
        public ParticlesTrackNode[]? Y;
    }

    public class ParticlesTrackNode
    {
        public float Time;
        public float? LowValue;
        public float? HighValue;
        public int? CurveType;
        public int? Distribution;
    }

    public enum ParticlesVersion { 
      PC = 1,
      Phone_32,
      Phone_64
    }

    public class Particles_Function
    {
        public static Particles ParseParticles(string inFile)
        {
            var particles = new Particles();
            foreach (ParticlesVersion version in Enum.GetValues(typeof(ParticlesVersion)))
            {
                try
                {
                    var rawFile = new SenBuffer(inFile);
                    particles = version switch
                    {
                        ParticlesVersion.PC => Particles_PC.Decode(rawFile),
                        ParticlesVersion.Phone_32 => Particles_Phone_32.Decode(rawFile),
                        ParticlesVersion.Phone_64 => Particles_Phone_64.Decode(rawFile),
                        _ => throw new Exception(Localization.GetString("unsupported_particles_platform"))
                    };
                }
                catch (Exception)
                {
                    particles = null;
                }
                if (particles is not null) break;
            }
            if (particles is null)
            {
                throw new Exception(Localization.GetString("particles_cannot_be_null"));
            }
            return particles;
        }

        public static SenBuffer WriteParticles(Particles particles, ParticlesVersion version)
        {
            var reanimFile = version switch
            {
                ParticlesVersion.PC => Particles_PC.Encode(particles),
                ParticlesVersion.Phone_32 => Particles_Phone_32.Encode(particles),
                ParticlesVersion.Phone_64 => Particles_Phone_64.Encode(particles),
                _ => throw new Exception(Localization.GetString("unsupported_particles_platform"))
            };
            return reanimFile;
        }
    }


    public class Particles_PC
    {
        public static SenBuffer Encode(Particles particles)
        {
            var senFile = new SenBuffer();
            senFile.writeInt32LE(1092589901);
            senFile.writeInt32LE(0);
            var count = particles.Emitters?.Length ?? 0;
            senFile.writeInt32LE(count);
            senFile.writeInt32LE(0x164);
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters![i];
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.ImageCol ?? 0);
                senFile.writeInt32LE(emitter.ImageRow ?? 0);
                senFile.writeInt32LE(emitter.ImageFrames ?? 1);
                senFile.writeInt32LE(emitter.Animated ?? 0);
                senFile.writeInt32LE(emitter.ParticleFlags);
                senFile.writeInt32LE(emitter.EmitterType ?? 1);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                for (var j = 0; j < 22; j++)
                {
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                }
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.Field?.Length ?? 0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.SystemField?.Length ?? 0);
                for (var j = 24; j < 40; j++)
                {
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                }
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters![i];
                senFile.writeStringByEmpty((string)emitter.Image!);
                senFile.writeStringByEmpty(emitter.Name!);
                WriteTrackNodes(senFile, emitter.SystemDuration);
                senFile.writeStringByEmpty(emitter.OnDuration!);
                WriteTrackNodes(senFile, emitter.CrossFadeDuration);
                WriteTrackNodes(senFile, emitter.SpawnRate);
                WriteTrackNodes(senFile, emitter.SpawnMinActive);
                WriteTrackNodes(senFile, emitter.SpawnMaxActive);
                WriteTrackNodes(senFile, emitter.SpawnMaxLaunched);
                WriteTrackNodes(senFile, emitter.EmitterRadius);
                WriteTrackNodes(senFile, emitter.EmitterOffsetX);
                WriteTrackNodes(senFile, emitter.EmitterOffsetY);
                WriteTrackNodes(senFile, emitter.EmitterBoxX);
                WriteTrackNodes(senFile, emitter.EmitterBoxY);
                WriteTrackNodes(senFile, emitter.EmitterPath);
                WriteTrackNodes(senFile, emitter.EmitterSkewX);
                WriteTrackNodes(senFile, emitter.EmitterSkewY);
                WriteTrackNodes(senFile, emitter.ParticleDuration);
                WriteTrackNodes(senFile, emitter.SystemRed);
                WriteTrackNodes(senFile, emitter.SystemGreen);
                WriteTrackNodes(senFile, emitter.SystemBlue);
                WriteTrackNodes(senFile, emitter.SystemAlpha);
                WriteTrackNodes(senFile, emitter.SystemBrightness);
                WriteTrackNodes(senFile, emitter.LaunchSpeed);
                WriteTrackNodes(senFile, emitter.LaunchAngle);
                WriteFields(senFile, emitter.Field);
                WriteFields(senFile, emitter.SystemField);
                WriteTrackNodes(senFile, emitter.ParticleRed);
                WriteTrackNodes(senFile, emitter.ParticleGreen);
                WriteTrackNodes(senFile, emitter.ParticleBlue);
                WriteTrackNodes(senFile, emitter.ParticleAlpha);
                WriteTrackNodes(senFile, emitter.ParticleBrightness);
                WriteTrackNodes(senFile, emitter.ParticleSpinAngle);
                WriteTrackNodes(senFile, emitter.ParticleSpinSpeed);
                WriteTrackNodes(senFile, emitter.ParticleScale);
                WriteTrackNodes(senFile, emitter.ParticleStretch);
                WriteTrackNodes(senFile, emitter.CollisionReflect);
                WriteTrackNodes(senFile, emitter.CollisionSpin);
                WriteTrackNodes(senFile, emitter.ClipTop);
                WriteTrackNodes(senFile, emitter.ClipBottom);
                WriteTrackNodes(senFile, emitter.ClipLeft);
                WriteTrackNodes(senFile, emitter.ClipRight);
                WriteTrackNodes(senFile, emitter.AnimationRate);
            }
            var rawFile = new SenBuffer();
            var compress = new Sen.Shell.Modules.Standards.Compress();
            rawFile.writeInt32LE(-559022380);
            rawFile.writeInt32LE((int)senFile.length);
            rawFile.writeBytes(compress.CompressZlib(senFile.toBytes(), ZlibCompressionLevel.DEFAULT_COMPRESSION));
            senFile.Close();
            return rawFile;
        }

        private static void WriteFields(SenBuffer senFile, ParticlesField[]? fields)
        {
            senFile.writeInt32LE(0x14);
            if (fields is null)
            {
                return;
            }
            var count = fields.Length;
            for (var i = 0; i < count; i++)
            {
                senFile.writeInt32LE(fields[i].FieldType ?? 0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
            }
            for (var i = 0; i < count; i++)
            {
                WriteTrackNodes(senFile, fields[i].X);
                WriteTrackNodes(senFile, fields[i].Y);
            }
        }

        private static void WriteTrackNodes(SenBuffer senFile, ParticlesTrackNode[]? nodes)
        {
            if (nodes is null)
            {
                senFile.writeInt32LE(0);
                return;
            }
            int count = nodes.Length;
            senFile.writeInt32LE(count);
            for (var i = 0; i < count; i++)
            {
                ParticlesTrackNode node = nodes[i];
                senFile.writeDoubleLE(node.Time);
                senFile.writeDoubleLE(node.LowValue ?? 0F);
                senFile.writeDoubleLE(node.HighValue ?? 0F);
                senFile.writeInt32LE(node.CurveType ?? 1);
                senFile.writeInt32LE(node.Distribution ?? 1);
            }
            return;
        }


        public static Particles Decode(SenBuffer rawFile)
        {
            var senFile = new SenBuffer();
            if (rawFile.peekInt32LE() == -559022380)
            {
                var compress = new Sen.Shell.Modules.Standards.Compress();
                rawFile.readOffset += 4;
                var size = rawFile.readInt32LE();
                senFile = new SenBuffer(compress.UncompressZlib(rawFile.readBytes((int)rawFile.length - 8)));
                rawFile.Close();
            }
            else
            {
                senFile = rawFile;
            }
            var particles = new Particles();
            senFile.readOffset = 8;
            var count = senFile.readInt32LE();
            particles.Emitters = new ParticlesEmitter[count];
            if (senFile.readInt32LE() != 0x164)
            {
                throw new Exception(Localization.GetString("unsupported_particles"));
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = new ParticlesEmitter();
                senFile.readOffset += 4;
                var tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.ImageCol = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.ImageRow = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 1) emitter.ImageFrames = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.Animated = tempInt;
                emitter.ParticleFlags = senFile.readInt32LE();
                tempInt = senFile.readInt32LE();
                if (tempInt != 1) emitter.EmitterType = tempInt;
                senFile.readOffset += 188;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.Field = new ParticlesField[tempInt];
                senFile.readOffset += 4;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.SystemField = new ParticlesField[tempInt];
                senFile.readOffset += 128;
                particles.Emitters[i] = emitter;
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters[i];
                string tempStr = senFile.readStringByInt32LE();
                if (!string.IsNullOrEmpty(tempStr)) emitter.Image = tempStr;
                tempStr = senFile.readStringByInt32LE();
                if (!string.IsNullOrEmpty(tempStr)) emitter.Name = tempStr;
                emitter.SystemDuration = ReadTrackNodes(senFile);
                tempStr = senFile.readStringByInt32LE();
                if (!string.IsNullOrEmpty(tempStr)) emitter.OnDuration = tempStr;
                emitter.CrossFadeDuration = ReadTrackNodes(senFile);
                emitter.SpawnRate = ReadTrackNodes(senFile);
                emitter.SpawnMinActive = ReadTrackNodes(senFile);
                emitter.SpawnMaxActive = ReadTrackNodes(senFile);
                emitter.SpawnMaxLaunched = ReadTrackNodes(senFile);
                emitter.EmitterRadius = ReadTrackNodes(senFile);
                emitter.EmitterOffsetX = ReadTrackNodes(senFile);
                emitter.EmitterOffsetY = ReadTrackNodes(senFile);
                emitter.EmitterBoxX = ReadTrackNodes(senFile);
                emitter.EmitterBoxY = ReadTrackNodes(senFile);
                emitter.EmitterPath = ReadTrackNodes(senFile);
                emitter.EmitterSkewX = ReadTrackNodes(senFile);
                emitter.EmitterSkewY = ReadTrackNodes(senFile);
                emitter.ParticleDuration = ReadTrackNodes(senFile);
                emitter.SystemRed = ReadTrackNodes(senFile);
                emitter.SystemGreen = ReadTrackNodes(senFile);
                emitter.SystemBlue = ReadTrackNodes(senFile);
                emitter.SystemAlpha = ReadTrackNodes(senFile);
                emitter.SystemBrightness = ReadTrackNodes(senFile);
                emitter.LaunchSpeed = ReadTrackNodes(senFile);
                emitter.LaunchAngle = ReadTrackNodes(senFile);
                if (senFile.readInt32LE() != 0x14)
                {
                    throw new Exception(Localization.GetString("undefined"));
                }
                var fields = emitter.Field;
                if (fields is not null)
                {
                    var fcount = fields.Length;
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = new ParticlesField();
                        var type = senFile.readInt32LE();
                        if (type != 0) field.FieldType = type;
                        senFile.readOffset += 16;
                        fields[k] = field;
                    }
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = fields[k];
                        field.X = ReadTrackNodes(senFile);
                        field.Y = ReadTrackNodes(senFile);
                    }
                }
                if (senFile.readInt32LE() != 0x14)
                {
                    throw new Exception("undefined");
                }
                fields = emitter.SystemField;
                if (fields is not null)
                {
                    var fcount = fields.Length;
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = new ParticlesField();
                        var type = senFile.readInt32LE();
                        if (type != 0)
                        {
                            field.FieldType = type;
                        }
                        senFile.readOffset += 16;
                        fields[k] = field;
                    }
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = fields[k];
                        field.X = ReadTrackNodes(senFile);
                        field.Y = ReadTrackNodes(senFile);
                    }
                }
                emitter.ParticleRed = ReadTrackNodes(senFile);
                emitter.ParticleGreen = ReadTrackNodes(senFile);
                emitter.ParticleBlue = ReadTrackNodes(senFile);
                emitter.ParticleAlpha = ReadTrackNodes(senFile);
                emitter.ParticleBrightness = ReadTrackNodes(senFile);
                emitter.ParticleSpinAngle = ReadTrackNodes(senFile);
                emitter.ParticleSpinSpeed = ReadTrackNodes(senFile);
                emitter.ParticleScale = ReadTrackNodes(senFile);
                emitter.ParticleStretch = ReadTrackNodes(senFile);
                emitter.CollisionReflect = ReadTrackNodes(senFile);
                emitter.CollisionSpin = ReadTrackNodes(senFile);
                emitter.ClipTop = ReadTrackNodes(senFile);
                emitter.ClipBottom = ReadTrackNodes(senFile);
                emitter.ClipLeft = ReadTrackNodes(senFile);
                emitter.ClipRight = ReadTrackNodes(senFile);
                emitter.AnimationRate = ReadTrackNodes(senFile);
            }
            return particles;
        }

        private static ParticlesTrackNode[]? ReadTrackNodes(SenBuffer senFile)
        {
            var count = senFile.readInt32LE();
            if (count == 0)
            {
                return null;
            }
            var ans = new ParticlesTrackNode[count];
            for (var i = 0; i < count; i++)
            {
                var node = new ParticlesTrackNode
                {
                    Time = senFile.readFloatLE()
                };
                float tempfloat = senFile.readFloatLE();
                if (tempfloat != 0) {
                    node.LowValue = tempfloat;
                }
                tempfloat = senFile.readFloatLE();
                if (tempfloat != 0)
                {
                    node.HighValue = tempfloat;
                }
                int tempint = senFile.readInt32LE();
                if (tempint != 1)
                {
                    node.CurveType = tempint;
                }
                tempint = senFile.readInt32LE();
                if (tempint != 1)
                {
                    node.Distribution = tempint;
                }
                ans[i] = node;
            }
            return ans;
        }
    }

    public class Particles_Phone_32
    {
        public static SenBuffer Encode(Particles particles)
        {
            var senFile = new SenBuffer();
            senFile.writeInt32LE(1092589901);
            senFile.writeInt32LE(0);
            var count = particles.Emitters?.Length ?? 0;
            senFile.writeInt32LE(count);
            senFile.writeInt32LE(0x164);
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters![i];
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.ImageCol ?? 0);
                senFile.writeInt32LE(emitter.ImageRow ?? 0);
                senFile.writeInt32LE(emitter.ImageFrames ?? 1);
                senFile.writeInt32LE(emitter.Animated ?? 0);
                senFile.writeInt32LE(emitter.ParticleFlags);
                senFile.writeInt32LE(emitter.EmitterType ?? 1);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                for (var j = 0; j < 22; j++)
                {
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                }
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.Field?.Length ?? 0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.SystemField?.Length ?? 0);
                for (var j = 24; j < 40; j++)
                {
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                }
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters![i];
                senFile.writeInt32LE(Convert.ToInt32(emitter.Image ?? -1));
                senFile.writeStringByEmpty(emitter.Name!);
                WriteTrackNodes(senFile, emitter.SystemDuration);
                senFile.writeStringByEmpty(emitter.OnDuration!);
                WriteTrackNodes(senFile, emitter.CrossFadeDuration);
                WriteTrackNodes(senFile, emitter.SpawnRate);
                WriteTrackNodes(senFile, emitter.SpawnMinActive);
                WriteTrackNodes(senFile, emitter.SpawnMaxActive);
                WriteTrackNodes(senFile, emitter.SpawnMaxLaunched);
                WriteTrackNodes(senFile, emitter.EmitterRadius);
                WriteTrackNodes(senFile, emitter.EmitterOffsetX);
                WriteTrackNodes(senFile, emitter.EmitterOffsetY);
                WriteTrackNodes(senFile, emitter.EmitterBoxX);
                WriteTrackNodes(senFile, emitter.EmitterBoxY);
                WriteTrackNodes(senFile, emitter.EmitterPath);
                WriteTrackNodes(senFile, emitter.EmitterSkewX);
                WriteTrackNodes(senFile, emitter.EmitterSkewY);
                WriteTrackNodes(senFile, emitter.ParticleDuration);
                WriteTrackNodes(senFile, emitter.SystemRed);
                WriteTrackNodes(senFile, emitter.SystemGreen);
                WriteTrackNodes(senFile, emitter.SystemBlue);
                WriteTrackNodes(senFile, emitter.SystemAlpha);
                WriteTrackNodes(senFile, emitter.SystemBrightness);
                WriteTrackNodes(senFile, emitter.LaunchSpeed);
                WriteTrackNodes(senFile, emitter.LaunchAngle);
                WriteFields(senFile, emitter.Field);
                WriteFields(senFile, emitter.SystemField);
                WriteTrackNodes(senFile, emitter.ParticleRed);
                WriteTrackNodes(senFile, emitter.ParticleGreen);
                WriteTrackNodes(senFile, emitter.ParticleBlue);
                WriteTrackNodes(senFile, emitter.ParticleAlpha);
                WriteTrackNodes(senFile, emitter.ParticleBrightness);
                WriteTrackNodes(senFile, emitter.ParticleSpinAngle);
                WriteTrackNodes(senFile, emitter.ParticleSpinSpeed);
                WriteTrackNodes(senFile, emitter.ParticleScale);
                WriteTrackNodes(senFile, emitter.ParticleStretch);
                WriteTrackNodes(senFile, emitter.CollisionReflect);
                WriteTrackNodes(senFile, emitter.CollisionSpin);
                WriteTrackNodes(senFile, emitter.ClipTop);
                WriteTrackNodes(senFile, emitter.ClipBottom);
                WriteTrackNodes(senFile, emitter.ClipLeft);
                WriteTrackNodes(senFile, emitter.ClipRight);
                WriteTrackNodes(senFile, emitter.AnimationRate);
            }
            var rawFile = new SenBuffer();
            var compress = new Sen.Shell.Modules.Standards.Compress();
            rawFile.writeInt32LE(-559022380);
            rawFile.writeInt32LE((int)senFile.length);
            rawFile.writeBytes(compress.CompressZlib(senFile.toBytes(), ZlibCompressionLevel.DEFAULT_COMPRESSION));
            senFile.Close();
            return rawFile;
        }

        private static void WriteFields(SenBuffer senFile, ParticlesField[]? fields)
        {
            senFile.writeInt32LE(0x14);
            if (fields is null)
            {
                return;
            }
            var count = fields.Length;
            for (var i = 0; i < count; i++)
            {
                senFile.writeInt32LE(fields[i].FieldType ?? 0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
            }
            for (var i = 0; i < count; i++)
            {
                WriteTrackNodes(senFile, fields[i].X);
                WriteTrackNodes(senFile, fields[i].Y);
            }
        }

        private static void WriteTrackNodes(SenBuffer senFile, ParticlesTrackNode[]? nodes)
        {
            if (nodes is null)
            {
                senFile.writeInt32LE(0);
                return;
            }
            var count = nodes.Length;
            senFile.writeInt32LE(count);
            for (var i = 0; i < count; i++)
            {
                ParticlesTrackNode node = nodes[i];
                senFile.writeDoubleLE(node.Time);
                senFile.writeDoubleLE(node.LowValue ?? 0F);
                senFile.writeDoubleLE(node.HighValue ?? 0F);
                senFile.writeInt32LE(node.CurveType ?? 1);
                senFile.writeInt32LE(node.Distribution ?? 1);
            }
        }


        public static Particles Decode(SenBuffer rawFile)
        {
            var senFile = new SenBuffer();
            if (rawFile.peekInt32LE() == -559022380)
            {
                var compress = new Sen.Shell.Modules.Standards.Compress();
                rawFile.readOffset += 4;
                var size = rawFile.readInt32LE();
                senFile = new SenBuffer(compress.UncompressZlib(rawFile.readBytes((int)rawFile.length - 8)));
                rawFile.Close();
            }
            else
            {
                senFile = rawFile;
            }
            var particles = new Particles();
            senFile.readOffset = 8;
            var count = senFile.readInt32LE();
            particles.Emitters = new ParticlesEmitter[count];
            if (senFile.readInt32LE() != 0x164)
            {
                throw new Exception("undefined");
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = new ParticlesEmitter();
                senFile.readOffset += 4;
                var tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.ImageCol = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.ImageRow = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 1) emitter.ImageFrames = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.Animated = tempInt;
                emitter.ParticleFlags = senFile.readInt32LE();
                tempInt = senFile.readInt32LE();
                if (tempInt != 1) emitter.EmitterType = tempInt;
                senFile.readOffset += 188;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.Field = new ParticlesField[tempInt];
                senFile.readOffset += 4;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.SystemField = new ParticlesField[tempInt];
                senFile.readOffset += 128;
                particles.Emitters[i] = emitter;
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters[i];
                var tempInt = senFile.readInt32LE();
                if (tempInt != -1) emitter.Image = tempInt;
                var tempStr = senFile.readStringByInt32LE();
                if (!string.IsNullOrEmpty(tempStr)) emitter.Name = tempStr;
                emitter.SystemDuration = ReadTrackNodes(senFile);
                tempStr = senFile.readStringByInt32LE();
                if (!string.IsNullOrEmpty(tempStr)) emitter.OnDuration = tempStr;
                emitter.CrossFadeDuration = ReadTrackNodes(senFile);
                emitter.SpawnRate = ReadTrackNodes(senFile);
                emitter.SpawnMinActive = ReadTrackNodes(senFile);
                emitter.SpawnMaxActive = ReadTrackNodes(senFile);
                emitter.SpawnMaxLaunched = ReadTrackNodes(senFile);
                emitter.EmitterRadius = ReadTrackNodes(senFile);
                emitter.EmitterOffsetX = ReadTrackNodes(senFile);
                emitter.EmitterOffsetY = ReadTrackNodes(senFile);
                emitter.EmitterBoxX = ReadTrackNodes(senFile);
                emitter.EmitterBoxY = ReadTrackNodes(senFile);
                emitter.EmitterPath = ReadTrackNodes(senFile);
                emitter.EmitterSkewX = ReadTrackNodes(senFile);
                emitter.EmitterSkewY = ReadTrackNodes(senFile);
                emitter.ParticleDuration = ReadTrackNodes(senFile);
                emitter.SystemRed = ReadTrackNodes(senFile);
                emitter.SystemGreen = ReadTrackNodes(senFile);
                emitter.SystemBlue = ReadTrackNodes(senFile);
                emitter.SystemAlpha = ReadTrackNodes(senFile);
                emitter.SystemBrightness = ReadTrackNodes(senFile);
                emitter.LaunchSpeed = ReadTrackNodes(senFile);
                emitter.LaunchAngle = ReadTrackNodes(senFile);
                if (senFile.readInt32LE() != 0x14)
                {
                    throw new Exception("undefined");
                }
                var fields = emitter.Field;
                if (fields is not null)
                {
                    var fcount = fields.Length;
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = new ParticlesField();
                        var type = senFile.readInt32LE();
                        if (type != 0)
                        {
                            field.FieldType = type;
                        }
                        senFile.readOffset += 16;
                        fields[k] = field;
                    }
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = fields[k];
                        field.X = ReadTrackNodes(senFile);
                        field.Y = ReadTrackNodes(senFile);
                    }
                }
                if (senFile.readInt32LE() != 0x14)
                {
                    throw new Exception("undefined");
                }
                fields = emitter.SystemField;
                if (fields is not null)
                {
                    var fcount = fields.Length;
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = new ParticlesField();
                        var type = senFile.readInt32LE();
                        if (type != 0)
                        {
                            field.FieldType = type;
                        }
                        senFile.readOffset += 16;
                        fields[k] = field;
                    }
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = fields[k];
                        field.X = ReadTrackNodes(senFile);
                        field.Y = ReadTrackNodes(senFile);
                    }
                }
                emitter.ParticleRed = ReadTrackNodes(senFile);
                emitter.ParticleGreen = ReadTrackNodes(senFile);
                emitter.ParticleBlue = ReadTrackNodes(senFile);
                emitter.ParticleAlpha = ReadTrackNodes(senFile);
                emitter.ParticleBrightness = ReadTrackNodes(senFile);
                emitter.ParticleSpinAngle = ReadTrackNodes(senFile);
                emitter.ParticleSpinSpeed = ReadTrackNodes(senFile);
                emitter.ParticleScale = ReadTrackNodes(senFile);
                emitter.ParticleStretch = ReadTrackNodes(senFile);
                emitter.CollisionReflect = ReadTrackNodes(senFile);
                emitter.CollisionSpin = ReadTrackNodes(senFile);
                emitter.ClipTop = ReadTrackNodes(senFile);
                emitter.ClipBottom = ReadTrackNodes(senFile);
                emitter.ClipLeft = ReadTrackNodes(senFile);
                emitter.ClipRight = ReadTrackNodes(senFile);
                emitter.AnimationRate = ReadTrackNodes(senFile);
            }
            return particles;
        }

        private static ParticlesTrackNode[]? ReadTrackNodes(SenBuffer senFile)
        {
            var count = senFile.readInt32LE();
            if (count == 0) return null;
            var ans = new ParticlesTrackNode[count];
            for (var i = 0; i < count; i++)
            {
                var node = new ParticlesTrackNode
                {
                    Time = senFile.readFloatLE()
                };
                var tempfloat = senFile.readFloatLE();
                if (tempfloat != 0) node.LowValue = tempfloat;
                tempfloat = senFile.readFloatLE();
                if (tempfloat != 0) node.HighValue = tempfloat;
                var tempint = senFile.readInt32LE();
                if (tempint != 1) node.CurveType = tempint;
                tempint = senFile.readInt32LE();
                if (tempint != 1) node.Distribution = tempint;
                ans[i] = node;
            }
            return ans;
        }
    }

    public class Particles_Phone_64
    {
        public static SenBuffer Encode(Particles particles)
        {
            var senFile = new SenBuffer();
            senFile.writeInt32LE(-527264279);
            senFile.writeInt32LE(0);
            senFile.writeInt32LE(0);
            var count = particles.Emitters?.Length ?? 0;
            senFile.writeInt32LE(count);
            senFile.writeInt32LE(0);
            senFile.writeInt32LE(0x2B0);
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters![i];
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.ImageCol ?? 0);
                senFile.writeInt32LE(emitter.ImageRow ?? 0);
                senFile.writeInt32LE(emitter.ImageFrames ?? 1);
                senFile.writeInt32LE(emitter.Animated ?? 0);
                senFile.writeInt32LE(emitter.ParticleFlags);
                senFile.writeInt32LE(emitter.EmitterType ?? 1);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                for (var j = 0; j < 22; j++)
                {
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                }
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.Field?.Length ?? 0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(emitter.SystemField?.Length ?? 0);
                for (var j = 24; j < 40; j++)
                {
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                    senFile.writeInt32LE(0);
                }
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters![i];
                senFile.writeInt32LE(Convert.ToInt32(emitter.Image ?? -1));
                senFile.writeStringByEmpty(emitter.Name!);
                WriteTrackNodes(senFile, emitter.SystemDuration);
                senFile.writeStringByEmpty(emitter.OnDuration!);
                WriteTrackNodes(senFile, emitter.CrossFadeDuration);
                WriteTrackNodes(senFile, emitter.SpawnRate);
                WriteTrackNodes(senFile, emitter.SpawnMinActive);
                WriteTrackNodes(senFile, emitter.SpawnMaxActive);
                WriteTrackNodes(senFile, emitter.SpawnMaxLaunched);
                WriteTrackNodes(senFile, emitter.EmitterRadius);
                WriteTrackNodes(senFile, emitter.EmitterOffsetX);
                WriteTrackNodes(senFile, emitter.EmitterOffsetY);
                WriteTrackNodes(senFile, emitter.EmitterBoxX);
                WriteTrackNodes(senFile, emitter.EmitterBoxY);
                WriteTrackNodes(senFile, emitter.EmitterPath);
                WriteTrackNodes(senFile, emitter.EmitterSkewX);
                WriteTrackNodes(senFile, emitter.EmitterSkewY);
                WriteTrackNodes(senFile, emitter.ParticleDuration);
                WriteTrackNodes(senFile, emitter.SystemRed);
                WriteTrackNodes(senFile, emitter.SystemGreen);
                WriteTrackNodes(senFile, emitter.SystemBlue);
                WriteTrackNodes(senFile, emitter.SystemAlpha);
                WriteTrackNodes(senFile, emitter.SystemBrightness);
                WriteTrackNodes(senFile, emitter.LaunchSpeed);
                WriteTrackNodes(senFile, emitter.LaunchAngle);
                WriteFields(senFile, emitter.Field);
                WriteFields(senFile, emitter.SystemField);
                WriteTrackNodes(senFile, emitter.ParticleRed);
                WriteTrackNodes(senFile, emitter.ParticleGreen);
                WriteTrackNodes(senFile, emitter.ParticleBlue);
                WriteTrackNodes(senFile, emitter.ParticleAlpha);
                WriteTrackNodes(senFile, emitter.ParticleBrightness);
                WriteTrackNodes(senFile, emitter.ParticleSpinAngle);
                WriteTrackNodes(senFile, emitter.ParticleSpinSpeed);
                WriteTrackNodes(senFile, emitter.ParticleScale);
                WriteTrackNodes(senFile, emitter.ParticleStretch);
                WriteTrackNodes(senFile, emitter.CollisionReflect);
                WriteTrackNodes(senFile, emitter.CollisionSpin);
                WriteTrackNodes(senFile, emitter.ClipTop);
                WriteTrackNodes(senFile, emitter.ClipBottom);
                WriteTrackNodes(senFile, emitter.ClipLeft);
                WriteTrackNodes(senFile, emitter.ClipRight);
                WriteTrackNodes(senFile, emitter.AnimationRate);
            }
            var rawFile = new SenBuffer();
            var compress = new Sen.Shell.Modules.Standards.Compress();
            rawFile.writeInt32LE(-559022380);
            rawFile.writeInt32LE(0);
            rawFile.writeInt32LE((int)senFile.length);
            rawFile.writeInt32LE(0);
            rawFile.writeBytes(compress.CompressZlib(senFile.toBytes(), ZlibCompressionLevel.DEFAULT_COMPRESSION));
            senFile.Close();
            return rawFile;
        }

        private static void WriteFields(SenBuffer senFile, ParticlesField[]? fields)
        {
            senFile.writeInt32LE(0x28);
            if (fields is null)
            {
                return;
            }
            var count = fields.Length;
            for (var i = 0; i < count; i++)
            {
                senFile.writeInt32LE(fields[i].FieldType ?? 0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
                senFile.writeInt32LE(0);
            }
            for (var i = 0; i < count; i++)
            {
                WriteTrackNodes(senFile, fields[i].X);
                WriteTrackNodes(senFile, fields[i].Y);
            }
        }

        private static void WriteTrackNodes(SenBuffer senFile, ParticlesTrackNode[]? nodes)
        {
            if (nodes is null)
            {
                senFile.writeInt32LE(0);
                return;
            }
            int count = nodes.Length;
            senFile.writeInt32LE(count);
            for (var i = 0; i < count; i++)
            {
                ParticlesTrackNode node = nodes[i];
                senFile.writeDoubleLE(node.Time);
                senFile.writeDoubleLE(node.LowValue ?? 0F);
                senFile.writeDoubleLE(node.HighValue ?? 0F);
                senFile.writeInt32LE(node.CurveType ?? 1);
                senFile.writeInt32LE(node.Distribution ?? 1);
            }
            return;
        }


        public static Particles Decode(SenBuffer rawFile)
        {
            var senFile = new SenBuffer();
            if (rawFile.peekInt32LE() == -559022380)
            {
                var compress = new Sen.Shell.Modules.Standards.Compress();
                rawFile.readOffset += 8;
                var size = rawFile.readInt32LE();
                rawFile.readOffset += 4;
                senFile = new SenBuffer(compress.UncompressZlib(rawFile.readBytes((int)rawFile.length - 8)));
                rawFile.Close();
            }
            else
            {
                senFile = rawFile;
            }
            var particles = new Particles();
            senFile.readOffset = 12;
            var count = senFile.readInt32LE();
            senFile.readOffset += 4;
            particles.Emitters = new ParticlesEmitter[count];
            if (senFile.readInt32LE() != 0x164)
            {
                throw new Exception("undefined");
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = new ParticlesEmitter();
                senFile.readOffset += 8;
                var tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.ImageCol = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.ImageRow = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 1) emitter.ImageFrames = tempInt;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.Animated = tempInt;
                emitter.ParticleFlags = senFile.readInt32LE();
                tempInt = senFile.readInt32LE();
                if (tempInt != 1) emitter.EmitterType = tempInt;
                senFile.readOffset += 376;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.Field = new ParticlesField[tempInt];
                senFile.readOffset += 12;
                tempInt = senFile.readInt32LE();
                if (tempInt != 0) emitter.SystemField = new ParticlesField[tempInt];
                senFile.readOffset += 260;
                particles.Emitters[i] = emitter;
            }
            for (var i = 0; i < count; i++)
            {
                var emitter = particles.Emitters[i];
                var tempInt = senFile.readInt32LE();
                if (tempInt != -1) emitter.Image = tempInt;
                var tempStr = senFile.readStringByInt32LE();
                if (!string.IsNullOrEmpty(tempStr)) emitter.Name = tempStr;
                emitter.SystemDuration = ReadTrackNodes(senFile);
                tempStr = senFile.readStringByInt32LE();
                if (!string.IsNullOrEmpty(tempStr)) emitter.OnDuration = tempStr;
                emitter.CrossFadeDuration = ReadTrackNodes(senFile);
                emitter.SpawnRate = ReadTrackNodes(senFile);
                emitter.SpawnMinActive = ReadTrackNodes(senFile);
                emitter.SpawnMaxActive = ReadTrackNodes(senFile);
                emitter.SpawnMaxLaunched = ReadTrackNodes(senFile);
                emitter.EmitterRadius = ReadTrackNodes(senFile);
                emitter.EmitterOffsetX = ReadTrackNodes(senFile);
                emitter.EmitterOffsetY = ReadTrackNodes(senFile);
                emitter.EmitterBoxX = ReadTrackNodes(senFile);
                emitter.EmitterBoxY = ReadTrackNodes(senFile);
                emitter.EmitterPath = ReadTrackNodes(senFile);
                emitter.EmitterSkewX = ReadTrackNodes(senFile);
                emitter.EmitterSkewY = ReadTrackNodes(senFile);
                emitter.ParticleDuration = ReadTrackNodes(senFile);
                emitter.SystemRed = ReadTrackNodes(senFile);
                emitter.SystemGreen = ReadTrackNodes(senFile);
                emitter.SystemBlue = ReadTrackNodes(senFile);
                emitter.SystemAlpha = ReadTrackNodes(senFile);
                emitter.SystemBrightness = ReadTrackNodes(senFile);
                emitter.LaunchSpeed = ReadTrackNodes(senFile);
                emitter.LaunchAngle = ReadTrackNodes(senFile);
                if (senFile.readInt32LE() != 0x28)
                {
                    throw new Exception("undefined");
                }
                var fields = emitter.Field;
                if (fields is not null)
                {
                    var fcount = fields.Length;
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = new ParticlesField();
                        var type = senFile.readInt32LE();
                        if (type != 0) field.FieldType = type;
                        senFile.readOffset += 36;
                        fields[k] = field;
                    }
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = fields[k];
                        field.X = ReadTrackNodes(senFile);
                        field.Y = ReadTrackNodes(senFile);
                    }
                }
                if (senFile.readInt32LE() != 0x28)
                {
                    throw new Exception("undefined");
                }
                fields = emitter.SystemField;
                if (fields is not null)
                {
                    var fcount = fields.Length;
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = new ParticlesField();
                        var type = senFile.readInt32LE();
                        if (type != 0) field.FieldType = type;
                        senFile.readOffset += 36;
                        fields[k] = field;
                    }
                    for (var k = 0; k < fcount; k++)
                    {
                        var field = fields[k];
                        field.X = ReadTrackNodes(senFile);
                        field.Y = ReadTrackNodes(senFile);
                    }
                }
                emitter.ParticleRed = ReadTrackNodes(senFile);
                emitter.ParticleGreen = ReadTrackNodes(senFile);
                emitter.ParticleBlue = ReadTrackNodes(senFile);
                emitter.ParticleAlpha = ReadTrackNodes(senFile);
                emitter.ParticleBrightness = ReadTrackNodes(senFile);
                emitter.ParticleSpinAngle = ReadTrackNodes(senFile);
                emitter.ParticleSpinSpeed = ReadTrackNodes(senFile);
                emitter.ParticleScale = ReadTrackNodes(senFile);
                emitter.ParticleStretch = ReadTrackNodes(senFile);
                emitter.CollisionReflect = ReadTrackNodes(senFile);
                emitter.CollisionSpin = ReadTrackNodes(senFile);
                emitter.ClipTop = ReadTrackNodes(senFile);
                emitter.ClipBottom = ReadTrackNodes(senFile);
                emitter.ClipLeft = ReadTrackNodes(senFile);
                emitter.ClipRight = ReadTrackNodes(senFile);
                emitter.AnimationRate = ReadTrackNodes(senFile);
            }
            return particles;
        }

        private static ParticlesTrackNode[]? ReadTrackNodes(SenBuffer senFile)
        {
            var count = senFile.readInt32LE();
            if (count == 0)
            {
                return null;
            }
            var ans = new ParticlesTrackNode[count];
            for (var i = 0; i < count; i++)
            {
                var node = new ParticlesTrackNode
                {
                    Time = senFile.readFloatLE()
                };
                float tempfloat = senFile.readFloatLE();
                if (tempfloat != 0)
                {
                    node.LowValue = tempfloat;
                }
                tempfloat = senFile.readFloatLE();
                if (tempfloat != 0)
                {
                    node.HighValue = tempfloat;
                }
                var tempint = senFile.readInt32LE();
                if (tempint != 1)
                {
                    node.CurveType = tempint;
                }
                tempint = senFile.readInt32LE();
                if (tempint != 1)
                {
                    node.Distribution = tempint;
                }
                ans[i] = node;
            }
            return ans;
        }
    }

    public class Particles_RawXml
    {
        private static Dictionary<string, int> EmitterEDic = new Dictionary<string, int> { { "Circle", 0 }, { "Box", 1 }, { "BoxPath", 2 }, { "CirclePath", 3 }, { "CircleEvenSpacing", 4 } };

        private static string[] EmitterType = new string[5] { "Circle", "Box", "BoxPath", "CirclePath", "CircleEvenSpacing" };

        private static Dictionary<string, int> TrailEDic = new Dictionary<string, int> { { "Constant", 0 }, { "Linear", 1 }, { "EaseIn", 2 }, { "EaseOut", 3 }, { "EaseInOut", 4 }, { "EaseInOutWeak", 5 }, { "FastInOut", 6 }, { "FastInOutWeak", 7 }, { "WeakFastInOut", 8 }, { "Bounce", 9 }, { "BounceFastMiddle", 10 }, { "BounceSlowMiddle", 11 }, { "SinWave", 12 }, { "EaseSinWave", 13 } };

        private static string[] TrailEnum = new string[14] { "Constant", "Linear", "EaseIn", "EaseOut", "EaseInOut", "EaseInOutWeak", "FastInOut", "FastInOutWeak", "WeakFastInOut", "Bounce", "BounceFastMiddle", "BounceSlowMiddle", "SinWave", "EaseSinWave" };

        private static Dictionary<string, int> FieldEDic = new Dictionary<string, int> { { "Invalid", 0 }, { "Friction", 1 }, { "Acceleration", 2 }, { "Attractor", 3 }, { "MaxVelocity", 4 }, { "Velocity", 5 }, { "Position", 6 }, { "SystemPosition", 7 }, { "GroundConstraint", 8 }, { "Shake", 9 }, { "Circle", 10 }, { "Away", 11 } };

        private static string[] FieldType = new string[12] { "Invalid", "Friction", "Acceleration", "Attractor", "MaxVelocity", "Velocity", "Position", "SystemPosition", "GroundConstraint", "Shake", "Circle", "Away" };
        public static Particles Decode(string inFile)
        {
            var particles = new Particles();
            string xmldata;
            using (StreamReader sr = new StreamReader(inFile))
            {
                xmldata = "<?xml version=\"1.0\" encoding=\"utf-8\"?><root>" + sr.ReadToEnd().Replace("&", "&amp;") + "</root>";
            }
            var xml = new XmlDocument();
            xml.LoadXml(xmldata);
            var root = xml.SelectSingleNode("/root")!;
            var childlist = root.ChildNodes;
            var EmitterNumber = childlist.Count;
            particles.Emitters = new ParticlesEmitter[EmitterNumber];
            var EmitterField = new List<ParticlesField>();
            var EmitterSystemField = new List<ParticlesField>();
            for (var i = 0; i < EmitterNumber; i++)
            {
                EmitterField.Clear();
                EmitterSystemField.Clear();
                var node_out = childlist[i]!;
                if (node_out.Name! != "Emitter")
                {
                    throw new Exception(Localization.GetString("particle_name_must_be_emitter"));
                }
                var emitter = new ParticlesEmitter();
                var childchildlist = node_out.ChildNodes;
                foreach (XmlNode node in childchildlist)
                {
                    switch (node.Name)
                    {
                        case "Name":
                            emitter.Name = node.InnerText;
                            break;
                        case "Image":
                            emitter.Image = node.InnerText;
                            break;
                        case "ImageResource":
                            emitter.ImagePath = node.InnerText;
                            break;
                        case "ImageCol":
                            emitter.ImageCol = Convert.ToInt32(node.InnerText);
                            break;
                        case "ImageRow":
                            emitter.ImageRow = Convert.ToInt32(node.InnerText);
                            break;
                        case "ImageFrames":
                            emitter.ImageFrames = Convert.ToInt32(node.InnerText);
                            break;
                        case "Animated":
                            emitter.Animated = Convert.ToInt32(node.InnerText);
                            break;
                        case "RandomLaunchSpin":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b1 : 0;
                            break;
                        case "AlignLaunchSpin":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b10 : 0;
                            break;
                        case "AlignToPixel":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b100 : 0;
                            break;
                        case "SystemLoops":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b1000 : 0;
                            break;
                        case "ParticleLoops":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b10000 : 0;
                            break;
                        case "ParticlesDontFollow":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b100000 : 0;
                            break;
                        case "RandomStartTime":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b1000000 : 0;
                            break;
                        case "DieIfOverloaded":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b10000000 : 0;
                            break;
                        case "Additive":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b100000000 : 0;
                            break;
                        case "FullScreen":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b1000000000 : 0;
                            break;
                        case "SoftwareOnly":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b10000000000 : 0;
                            break;
                        case "HardwareOnly":
                            emitter.ParticleFlags |= node.InnerText == "1" ? 0b100000000000 : 0;
                            break;
                        case "EmitterType": //eg: Emitter(15)
                            if (EmitterEDic.TryGetValue(node.InnerText, out int value))
                            {
                                emitter.EmitterType = value;
                            }
                            else
                            {
                                emitter.EmitterType = Convert.ToInt32(node.InnerText[8..^1]);
                            }
                            break;
                        case "OnDuration":
                            emitter.OnDuration = node.InnerText;
                            break;
                        case "SystemDuration":
                            emitter.SystemDuration = ReadTrackNode(node.InnerText);
                            break;
                        case "CrossFadeDuration":
                            emitter.CrossFadeDuration = ReadTrackNode(node.InnerText);
                            break;
                        case "SpawnRate":
                            emitter.SpawnRate = ReadTrackNode(node.InnerText);
                            break;
                        case "SpawnMinActive":
                            emitter.SpawnMinActive = ReadTrackNode(node.InnerText);
                            break;
                        case "SpawnMaxActive":
                            emitter.SpawnMaxActive = ReadTrackNode(node.InnerText);
                            break;
                        case "SpawnMaxLaunched":
                            emitter.SpawnMaxLaunched = ReadTrackNode(node.InnerText);
                            break;
                        case "EmitterRadius":
                            emitter.EmitterRadius = ReadTrackNode(node.InnerText);
                            break;
                        case "EmitterOffsetX":
                            emitter.EmitterOffsetX = ReadTrackNode(node.InnerText);
                            break;
                        case "EmitterOffsetY":
                            emitter.EmitterOffsetY = ReadTrackNode(node.InnerText);
                            break;
                        case "EmitterBoxX":
                            emitter.EmitterBoxX = ReadTrackNode(node.InnerText);
                            break;
                        case "EmitterBoxY":
                            emitter.EmitterBoxY = ReadTrackNode(node.InnerText);
                            break;
                        case "EmitterPath":
                            emitter.EmitterPath = ReadTrackNode(node.InnerText);
                            break;
                        case "EmitterSkewX":
                            emitter.EmitterSkewX = ReadTrackNode(node.InnerText);
                            break;
                        case "EmitterSkewY":
                            emitter.EmitterSkewY = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleDuration":
                            emitter.ParticleDuration = ReadTrackNode(node.InnerText);
                            break;
                        case "SystemRed":
                            emitter.SystemRed = ReadTrackNode(node.InnerText);
                            break;
                        case "SystemGreen":
                            emitter.SystemGreen = ReadTrackNode(node.InnerText);
                            break;
                        case "SystemBlue":
                            emitter.SystemBlue = ReadTrackNode(node.InnerText);
                            break;
                        case "SystemAlpha":
                            emitter.SystemAlpha = ReadTrackNode(node.InnerText);
                            break;
                        case "SystemBrightness":
                            emitter.SystemBrightness = ReadTrackNode(node.InnerText);
                            break;
                        case "LaunchSpeed":
                            emitter.LaunchSpeed = ReadTrackNode(node.InnerText);
                            break;
                        case "LaunchAngle":
                            emitter.LaunchAngle = ReadTrackNode(node.InnerText);
                            break;
                        case "Field":
                            EmitterField.Add(ReadField(node));
                            break;
                        case "SystemField":
                            EmitterSystemField.Add(ReadField(node));
                            break;
                        case "ParticleRed":
                            emitter.ParticleRed = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleGreen":
                            emitter.ParticleGreen = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleBlue":
                            emitter.ParticleBlue = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleAlpha":
                            emitter.ParticleAlpha = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleBrightness":
                            emitter.ParticleBrightness = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleSpinAngle":
                            emitter.ParticleSpinAngle = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleSpinSpeed":
                            emitter.ParticleSpinSpeed = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleScale":
                            emitter.ParticleScale = ReadTrackNode(node.InnerText);
                            break;
                        case "ParticleStretch":
                            emitter.ParticleStretch = ReadTrackNode(node.InnerText);
                            break;
                        case "CollisionReflect":
                            emitter.CollisionReflect = ReadTrackNode(node.InnerText);
                            break;
                        case "CollisionSpin":
                            emitter.CollisionSpin = ReadTrackNode(node.InnerText);
                            break;
                        case "ClipTop":
                            emitter.ClipTop = ReadTrackNode(node.InnerText);
                            break;
                        case "ClipBottom":
                            emitter.ClipBottom = ReadTrackNode(node.InnerText);
                            break;
                        case "ClipLeft":
                            emitter.ClipLeft = ReadTrackNode(node.InnerText);
                            break;
                        case "ClipRight":
                            emitter.ClipRight = ReadTrackNode(node.InnerText);
                            break;
                        case "AnimationRate":
                            emitter.AnimationRate = ReadTrackNode(node.InnerText);
                            break;
                    }
                }
                emitter.Field = EmitterField.ToArray();
                emitter.SystemField = EmitterSystemField.ToArray();
                particles.Emitters[i] = emitter;
            }
            return particles;
        }

        private static ParticlesField ReadField(XmlNode root)
        {
            var field = new ParticlesField();
            var childnodes = root.ChildNodes;
            foreach (XmlNode node in childnodes)
            {
                switch (node.Name)
                {
                    case "FieldType":
                        if (FieldEDic.ContainsKey(node.InnerText))
                        {
                            field.FieldType = FieldEDic[node.InnerText];
                        }
                        else
                        {
                            field.FieldType = Convert.ToInt32(node.InnerText[6..^1]); //eg:Field(15)
                        }
                        break;
                    case "X":
                        field.X = ReadTrackNode(node.InnerText);
                        break;
                    case "Y":
                        field.Y = ReadTrackNode(node.InnerText);
                        break;
                }
            }
            return field;
        }

        private static ParticlesTrackNode[] ReadTrackNode(string inText)
        {
            var ans = new List<ParticlesTrackNode>();
            var length = inText.Length;
            var i = 0;
            while (i < length)
            {
                var node = new ParticlesTrackNode();
                //Min, Max, Distribution
                var next = inText[i];
                if (next == '[')
                {
                    //Read First Number
                    i++;
                    var j = i;
                    while (true)
                    {
                        j++;
                        var next2 = inText[j];
                        if (next2 == ' ' || next2 == ']') break;
                    }
                    var n = Convert.ToSingle(inText[i..j]);
                    node.LowValue = n;
                    //Check Next Token
                    if (inText[j] == ']')
                    {
                        node.HighValue = n;
                        node.Distribution = 0; //Only one number => Constant
                        i = j + 1;
                    }
                    else
                    {
                        //Is Distribution?
                        i = ++j;
                        var next2 = inText[i];
                        if (next2 >= 'A' && next2 <= 'Z')
                        {
                            while (true)
                            {
                                j++;
                                if (inText[j] == ' ') break;
                            }
                            string temp = inText[i..j];
                            if (TrailEDic.ContainsKey(temp))
                            {
                                node.Distribution = TrailEDic[temp];
                            }
                            else
                            {
                                node.Distribution = Convert.ToInt32(temp[10..^1]); //eg: TodCurves(15)
                            }
                            i = ++j;
                        }
                        else
                        {
                            node.Distribution = 1; //Two Number => Linear
                        }
                        //Last Number
                        while (true)
                        {
                            j++;
                            if (inText[j] == ']') break;
                        }
                        n = Convert.ToSingle(inText[i..j]);
                        node.HighValue = n;
                        i = ++j;
                    }
                }
                else if (next == '.' || next == '-' || (next >= '0' && next <= '9'))
                {
                    //Read a number
                    var j = i;
                    while (true)
                    {
                        j++;
                        if (j >= length) break;
                        char next2 = inText[j];
                        if (next2 == ' ' || next2 == ',') break;
                    }
                    var n = Convert.ToSingle(inText[i..j]);
                    node.LowValue = n;
                    node.HighValue = n;
                    node.Distribution = 1; //Only One Number Without [] => Linear
                    i = j;
                }
                else
                {
                    node.LowValue = 0;
                    node.HighValue = 0;
                    node.Distribution = 1;
                }
                //Time
                if (i >= length)
                {
                    node.Time = -10000;
                    node.CurveType = 1;
                    ans.Add(node);
                    break;
                }
                next = inText[i];
                if (next == ',')
                {
                    i++;
                    int j = i;
                    while (true)
                    {
                        j++;
                        if (j >= length || inText[j] == ' ') break;
                    }
                    node.Time = Convert.ToSingle(inText[i..j]);
                    i = j;
                }
                else
                {
                    node.Time = -10000;
                }
                //CurveType
                if ((++i) >= length)
                {
                    node.CurveType = 1;
                    ans.Add(node);
                    break;
                }
                next = inText[i];
                if (next < 'A' || next > 'Z')
                {
                    node.CurveType = 1;
                }
                else
                {
                    var j = i;
                    while (true)
                    {
                        j++;
                        if (j >= length || inText[j] == ' ') break;
                    }
                    string temp = inText[i..j];
                    if (TrailEDic.ContainsKey(temp))
                    {
                        node.CurveType = TrailEDic[temp];
                    }
                    else
                    {
                        node.CurveType = Convert.ToInt32(temp[10..^1]); //e.g.: TodCurves(15)
                    }
                    i = ++j;
                }
                ans.Add(node);
            }
            var realans = ans.ToArray();
            //Default Times
            int tNum = realans.Length;
            if (tNum == 0) return realans;
            if (realans[0].Time < -1000) realans[0].Time = 0;
            if (tNum != 1 && realans[tNum - 1].Time < -1000)
            {
                realans[tNum - 1].Time = 100;
            }
            float delta = 0, last = 0;
            for (i = 0; i < tNum; i++)
            {
                if (realans[i].Time >= -1000)
                {
                    last = realans[i].Time;
                    //Find the delta
                    if (i < tNum - 1)
                    {
                        var j = i + 1;
                        while (realans[j].Time < -1000)
                        {
                            j++;
                        }
                        delta = (realans[j].Time - realans[i].Time) / delta;
                    }
                }
                else
                {
                    realans[i].Time = last + delta;
                }
                realans[i].Time /= 100;
            }
            return realans;
        }

        public static void Encode(Particles particles, string outFile)
        {
            using var sw = new StreamWriter(outFile, false);
            var emitters = particles.Emitters;
            if (emitters is not null && emitters.Length > 0)
            {
                var count = emitters.Length;
                for (var i = 0; i < count; i++)
                {
                    sw.Write("<Emitter>\n");
                    ParticlesEmitter emitter = emitters[i];
                    if (emitter is not null)
                    {
                        if (emitter.Name is not null)
                        {
                            sw.Write("  <Name>");
                            sw.Write(emitter.Name);
                            sw.Write("</Name>\n");
                        }
                        if (emitter.SpawnMinActive is not null)
                        {
                            sw.Write("  <SpawnMinActive>");
                            WriteTrackNode(emitter.SpawnMinActive, sw);
                            sw.Write("</SpawnMinActive>\n");
                        }
                        if (emitter.SpawnMaxLaunched is not null)
                        {
                            sw.Write("  <SpawnMaxLaunched>");
                            WriteTrackNode(emitter.SpawnMaxLaunched, sw);
                            sw.Write("</SpawnMaxLaunched>\n");
                        }
                        if (emitter.ParticleDuration is not null)
                        {
                            sw.Write("  <ParticleDuration>");
                            WriteTrackNode(emitter.ParticleDuration, sw);
                            sw.Write("</ParticleDuration>\n");
                        }
                        if (emitter.ParticleRed is not null)
                        {
                            sw.Write("  <ParticleRed>");
                            WriteTrackNode(emitter.ParticleRed, sw);
                            sw.Write("</ParticleRed>\n");
                        }
                        if (emitter.ParticleGreen is not null)
                        {
                            sw.Write("  <ParticleGreen>");
                            WriteTrackNode(emitter.ParticleGreen, sw);
                            sw.Write("</ParticleGreen>\n");
                        }
                        if (emitter.ParticleBlue is not null)
                        {
                            sw.Write("  <ParticleBlue>");
                            WriteTrackNode(emitter.ParticleBlue, sw);
                            sw.Write("</ParticleBlue>\n");
                        }
                        if (emitter.ParticleAlpha is not null)
                        {
                            sw.Write("  <ParticleAlpha>");
                            WriteTrackNode(emitter.ParticleAlpha, sw);
                            sw.Write("</ParticleAlpha>\n");
                        }
                        if (emitter.ParticleBrightness is not null)
                        {
                            sw.Write("  <ParticleBrightness>");
                            WriteTrackNode(emitter.ParticleBrightness, sw);
                            sw.Write("</ParticleBrightness>\n");
                        }
                        if (emitter.ParticleSpinAngle is not null)
                        {
                            sw.Write("  <ParticleSpinAngle>");
                            WriteTrackNode(emitter.ParticleSpinAngle, sw);
                            sw.Write("</ParticleSpinAngle>\n");
                        }
                        if (emitter.ParticleScale is not null)
                        {
                            sw.Write("  <ParticleScale>");
                            WriteTrackNode(emitter.ParticleScale, sw);
                            sw.Write("</ParticleScale>\n");
                        }
                        if (emitter.ParticleStretch is not null)
                        {
                            sw.Write("  <ParticleStretch>");
                            WriteTrackNode(emitter.ParticleStretch, sw);
                            sw.Write("</ParticleStretch>\n");
                        }
                        if (emitter.EmitterRadius is not null)
                        {
                            sw.Write("  <EmitterRadius>");
                            WriteTrackNode(emitter.EmitterRadius, sw);
                            sw.Write("</EmitterRadius>\n");
                        }
                        int flags = emitter.EmitterType ?? 1;
                        if (flags != 1)
                        {
                            sw.Write("  <EmitterType>");
                            if (flags < 0 || flags > 4)
                            {
                                sw.Write(EmitterType[flags]);
                            }
                            else
                            {
                                sw.Write("Emitter(");
                                sw.Write(flags);
                                sw.Write(')');
                            }
                            sw.Write("</EmitterType>\n");
                        }
                        if (emitter.SystemDuration is not null)
                        {
                            sw.Write("  <SystemDuration>");
                            WriteTrackNode(emitter.SystemDuration, sw);
                            sw.Write("</SystemDuration>\n");
                        }
                        if (emitter.AnimationRate is not null)
                        {
                            sw.Write("  <AnimationRate>");
                            WriteTrackNode(emitter.AnimationRate, sw);
                            sw.Write("</AnimationRate>\n");
                        }
                        if (emitter.ImageFrames is not null)
                        {
                            sw.Write("  <ImageFrames>");
                            sw.Write(emitter.ImageFrames);
                            sw.Write("</ImageFrames>\n");
                        }
                        if (emitter.EmitterOffsetX is not null)
                        {
                            sw.Write("  <EmitterOffsetX>");
                            WriteTrackNode(emitter.EmitterOffsetX, sw);
                            sw.Write("</EmitterOffsetX>\n");
                        }
                        if (emitter.EmitterOffsetY is not null)
                        {
                            sw.Write("  <EmitterOffsetY>");
                            WriteTrackNode(emitter.EmitterOffsetY, sw);
                            sw.Write("</EmitterOffsetY>\n");
                        }
                        if (emitter.EmitterBoxX is not null)
                        {
                            sw.Write("  <EmitterBoxX>");
                            WriteTrackNode(emitter.EmitterBoxX, sw);
                            sw.Write("</EmitterBoxX>\n");
                        }
                        if (emitter.EmitterBoxY is not null)
                        {
                            sw.Write("  <EmitterBoxY>");
                            WriteTrackNode(emitter.EmitterBoxY, sw);
                            sw.Write("</EmitterBoxY>\n");
                        }
                        if (emitter.EmitterPath is not null)
                        {
                            sw.Write("  <EmitterPath>");
                            WriteTrackNode(emitter.EmitterPath, sw);
                            sw.Write("</EmitterPath>\n");
                        }
                        if (emitter.EmitterSkewX is not null)
                        {
                            sw.Write("  <EmitterSkewX>");
                            WriteTrackNode(emitter.EmitterSkewX, sw);
                            sw.Write("</EmitterSkewX>\n");
                        }
                        if (emitter.EmitterSkewY is not null)
                        {
                            sw.Write("  <EmitterSkewY>");
                            WriteTrackNode(emitter.EmitterSkewY, sw);
                            sw.Write("</EmitterSkewY>\n");
                        }
                        if (emitter.Image is not null)
                        {
                            sw.Write("  <Image>");
                            sw.Write(emitter.Image);
                            sw.Write("</Image>\n");
                        }
                        if (emitter.ImagePath is not null)
                        {
                            sw.Write("  <ImageResource>");
                            sw.Write(emitter.ImagePath);
                            sw.Write("</ImageResource>\n");
                        }
                        if (emitter.Field is not null)
                        {
                            WriteFields(emitter.Field, sw, "Field");
                        }
                        if (emitter.SystemField is not null)
                        {
                            WriteFields(emitter.SystemField, sw, "SystemField");
                        }
                        if (emitter.ParticleSpinSpeed is not null)
                        {
                            sw.Write("  <ParticleSpinSpeed>");
                            WriteTrackNode(emitter.ParticleSpinSpeed, sw);
                            sw.Write("</ParticleSpinSpeed>\n");
                        }
                        if (emitter.ImageCol is not null)
                        {
                            sw.Write("  <ImageCol>");
                            sw.Write(emitter.ImageCol);
                            sw.Write("</ImageCol>\n");
                        }
                        if (emitter.ImageRow is not null)
                        {
                            sw.Write("  <ImageRow>");
                            sw.Write(emitter.ImageRow);
                            sw.Write("</ImageRow>\n");
                        }
                        if (emitter.Animated is not null)
                        {
                            sw.Write("  <Animated>");
                            sw.Write(emitter.Animated);
                            sw.Write("</Animated>\n");
                        }
                        flags = emitter.ParticleFlags;
                        if ((flags & 0b1) != 0)
                        {
                            sw.Write("  <RandomLaunchSpin>1</RandomLaunchSpin>\n");
                        }
                        if ((flags & 0b10) != 0)
                        {
                            sw.Write("  <AlignLaunchSpin>1</AlignLaunchSpin>\n");
                        }
                        if ((flags & 0b100) != 0)
                        {
                            sw.Write("  <AlignToPixel>1</AlignToPixel>\n");
                        }
                        if ((flags & 0b1000) != 0)
                        {
                            sw.Write("  <SystemLoops>1</SystemLoops>\n");
                        }
                        if ((flags & 0b10000) != 0)
                        {
                            sw.Write("  <ParticleLoops>1</ParticleLoops>\n");
                        }
                        if ((flags & 0b100000) != 0)
                        {
                            sw.Write("  <ParticlesDontFollow>1</ParticlesDontFollow>\n");
                        }
                        if ((flags & 0b1000000) != 0)
                        {
                            sw.Write("  <RandomStartTime>1</RandomStartTime>\n");
                        }
                        if ((flags & 0b10000000) != 0)
                        {
                            sw.Write("  <DieIfOverloaded>1</DieIfOverloaded>\n");
                        }
                        if ((flags & 0b100000000) != 0)
                        {
                            sw.Write("  <Additive>1</Additive>\n");
                        }
                        if ((flags & 0b1000000000) != 0)
                        {
                            sw.Write("  <FullScreen>1</FullScreen>\n");
                        }
                        if ((flags & 0b10000000000) != 0)
                        {
                            sw.Write("  <SoftwareOnly>1</SoftwareOnly>\n");
                        }
                        if ((flags & 0b100000000000) != 0)
                        {
                            sw.Write("  <HardwareOnly>1</HardwareOnly>\n");
                        }
                        if (emitter.OnDuration is not null)
                        {
                            sw.Write("  <OnDuration>");
                            sw.Write(emitter.OnDuration);
                            sw.Write("</OnDuration>\n");
                        }
                        if (emitter.CrossFadeDuration is not null)
                        {
                            sw.Write("  <CrossFadeDuration>");
                            WriteTrackNode(emitter.CrossFadeDuration, sw);
                            sw.Write("</CrossFadeDuration>\n");
                        }
                        if (emitter.SpawnRate is not null)
                        {
                            sw.Write("  <SpawnRate>");
                            WriteTrackNode(emitter.SpawnRate, sw);
                            sw.Write("</SpawnRate>\n");
                        }
                        if (emitter.SpawnMaxActive is not null)
                        {
                            sw.Write("  <SpawnMaxActive>");
                            WriteTrackNode(emitter.SpawnMaxActive, sw);
                            sw.Write("</SpawnMaxActive>\n");
                        }
                        if (emitter.SystemRed is not null)
                        {
                            sw.Write("  <SystemRed>");
                            WriteTrackNode(emitter.SystemRed, sw);
                            sw.Write("</SystemRed>\n");
                        }
                        if (emitter.SystemGreen is not null)
                        {
                            sw.Write("  <SystemGreen>");
                            WriteTrackNode(emitter.SystemGreen, sw);
                            sw.Write("</SystemGreen>\n");
                        }
                        if (emitter.SystemBlue is not null)
                        {
                            sw.Write("  <SystemBlue>");
                            WriteTrackNode(emitter.SystemBlue, sw);
                            sw.Write("</SystemBlue>\n");
                        }
                        if (emitter.SystemAlpha is not null)
                        {
                            sw.Write("  <SystemAlpha>");
                            WriteTrackNode(emitter.SystemAlpha, sw);
                            sw.Write("</SystemAlpha>\n");
                        }
                        if (emitter.SystemBrightness is not null)
                        {
                            sw.Write("  <SystemBrightness>");
                            WriteTrackNode(emitter.SystemBrightness, sw);
                            sw.Write("</SystemBrightness>\n");
                        }
                        if (emitter.LaunchSpeed is not null)
                        {
                            sw.Write("  <LaunchSpeed>");
                            WriteTrackNode(emitter.LaunchSpeed, sw);
                            sw.Write("</LaunchSpeed>\n");
                        }
                        if (emitter.LaunchAngle is not null)
                        {
                            sw.Write("  <LaunchAngle>");
                            WriteTrackNode(emitter.LaunchAngle, sw);
                            sw.Write("</LaunchAngle>\n");
                        }
                        if (emitter.CollisionReflect is not null)
                        {
                            sw.Write("  <CollisionReflect>");
                            WriteTrackNode(emitter.CollisionReflect, sw);
                            sw.Write("</CollisionReflect>\n");
                        }
                        if (emitter.CollisionSpin is not null)
                        {
                            sw.Write("  <CollisionSpin>");
                            WriteTrackNode(emitter.CollisionSpin, sw);
                            sw.Write("</CollisionSpin>\n");
                        }
                        if (emitter.ClipTop is not null)
                        {
                            sw.Write("  <ClipTop>");
                            WriteTrackNode(emitter.ClipTop, sw);
                            sw.Write("</ClipTop>\n");
                        }
                        if (emitter.ClipBottom is not null)
                        {
                            sw.Write("  <ClipBottom>");
                            WriteTrackNode(emitter.ClipBottom, sw);
                            sw.Write("</ClipBottom>\n");
                        }
                        if (emitter.ClipLeft is not null)
                        {
                            sw.Write("  <ClipLeft>");
                            WriteTrackNode(emitter.ClipLeft, sw);
                            sw.Write("</ClipLeft>\n");
                        }
                        if (emitter.ClipRight is not null)
                        {
                            sw.Write("  <ClipRight>");
                            WriteTrackNode(emitter.ClipRight, sw);
                            sw.Write("</ClipRight>\n");
                        }
                    }
                    sw.Write("</Emitter>\n");
                }
            }
        }
        
        static void WriteFields(ParticlesField[] fields, StreamWriter sw, string FieldsName)
        {
            var length = fields.Length;
            if (length == 0)
            {
                return;
            }
            for (var i = 0; i < length; i++)
            {
                ParticlesField field = fields[i];
                sw.Write("  <");
                sw.Write(FieldsName);
                sw.Write(">\n");
                var type = field.FieldType ?? 0;
                if (type != 0)
                {
                    sw.Write("    <FieldType>");
                    if (type < 0 || type > 11)
                    {
                        sw.Write("Field(");
                        sw.Write(type);
                        sw.Write(')');
                    }
                    else
                    {
                        sw.Write(FieldType[type]);
                    }
                    sw.Write("</FieldType>\n");
                }
                if (field.X is not null)
                {
                    sw.Write("    <X>");
                    WriteTrackNode(field.X, sw);
                    sw.Write("</X>\n");
                }
                if (field.Y is not null)
                {
                    sw.Write("    <Y>");
                    WriteTrackNode(field.Y, sw);
                    sw.Write("</Y>\n");
                }
                sw.Write("  </");
                sw.Write(FieldsName);
                sw.Write(">\n");
            }
            return;
        }

        private static string FloatToString(float? f)
        {
            var ans = f.ToString()!;
            return ans.StartsWith("0.") ? ans[1..] : ans;
        }

        private static void WriteTrackNode(ParticlesTrackNode[] track, StreamWriter sw)
        {
            var length = track.Length;
            for (var i = 0; i < length; i++)
            {
                if (i > 0) sw.Write(' ');
                var node = track[i];
                var Distribution = node.Distribution ?? 1;
                node.LowValue ??= 0;
                node.HighValue ??= 0;
                node.CurveType ??= 1;
                //Min, Max, Distribution
                if (node.LowValue == node.HighValue)
                {
                    if (Distribution == 0)
                    {
                        sw.Write('[');
                        sw.Write(FloatToString(node.LowValue));
                        sw.Write(']');
                    }
                    else if (Distribution == 1)
                    {
                        sw.Write(FloatToString(node.LowValue));
                    }
                    else
                    {
                        sw.Write('[');
                        sw.Write(FloatToString(node.LowValue));
                        sw.Write(' ');
                        if (Distribution < 0 || Distribution > 13)
                        {
                            sw.Write("TodCurves(");
                            sw.Write(Distribution);
                            sw.Write(')');
                        }
                        else
                        {
                            sw.Write(TrailEnum[Distribution]);
                        }
                        sw.Write(' ');
                        sw.Write(FloatToString(node.HighValue));
                        sw.Write(']');
                    }
                }
                else
                {
                    sw.Write('[');
                    sw.Write(FloatToString(node.LowValue));
                    if (Distribution != 1)
                    {
                        sw.Write(' ');
                        if (Distribution < 0 || Distribution > 13)
                        {
                            sw.Write("TodCurves(");
                            sw.Write(Distribution);
                            sw.Write(')');
                        }
                        else
                        {
                            sw.Write(TrailEnum[Distribution]);
                        }
                    }
                    sw.Write(' ');
                    sw.Write(FloatToString(node.HighValue));
                    sw.Write(']');
                }
                //Time
                if (node.Time != 0 && node.Time != 1)
                {
                    sw.Write(',');
                    sw.Write(node.Time * 100);
                }
                //Curves
                if (node.CurveType != 1)
                {
                    sw.Write(' ');
                    if (Distribution < 0 || Distribution > 13)
                    {
                        sw.Write("TodCurves(");
                        sw.Write(Distribution);
                        sw.Write(')');
                    }
                    else
                    {
                        sw.Write(TrailEnum[Distribution]);
                    }
                }
            }
            return;
        }
    }
}